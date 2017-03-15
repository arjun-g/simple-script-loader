(function(window){

    class LoadScript{

        constructor(configOrPath){
            if(configOrPath.scripts)
                this.config = configOrPath
            else
                this.configPath = configOrPath
            this.loadCount = 0
        }

        load(loaded){
            return new Promise((resolve, reject) => {
                this.loadConfig()
                .then(config => {
                    let scriptDoms = config.scripts.map(scriptConfig => {
                        let script = document.createElement('script')
                        let self = this
                        script.onload = function(){
                            if(loaded) loaded(++self.loadCount, config.scripts.length)
                            if(self.loadCount ===  config.scripts.length) resolve()
                        }
                        script.onerror = function(){
                            reject()
                        }
                        script.src = scriptConfig.path || scriptConfig
                        script.async = !!scriptConfig.async
                        return script
                    })
                    let scriptContainer = document.createElement('DIV')
                    scriptDoms.forEach(scriptDom => {
                        scriptContainer.appendChild(scriptDom)
                    })
                    document.body.appendChild(scriptContainer)
                })
            })
        }

        loadConfig(){
            return new Promise((resolve, reject) => {
                if(this.config) return resolve(this.config)
                this.downloadJSON(this.configPath).then(resolve).catch(reject)
            })
        }

        downloadJSON(path){
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest()
                xhr.open('GET', path)
                xhr.onload = function(e){
                    if(this.status !== 200) return reject()
                    resolve(JSON.parse(this.response))
                }
                xhr.onerror = function(e){
                    reject(e)
                }
                xhr.send()
            })
        }

    }

    window.LoadScript = LoadScript

})(window);