(function(window){

    class LoadScript{

        constructor(configOrPath){
            if(configOrPath.scripts)
                this.config = configOrPath
            else
                this.configPath = configOrPath
        }

        load(){
            return new Promise((resolve, reject) => {
                let loadCount = 0
                this.loadConfig()
                .then(config => {
                    config.scripts.forEach(script => {
                        this.downloadScript(script).then(() => {
                            loadCount++
                            if(loadCount === config.scripts.length) resolve()
                        })
                    })
                })
            })
            return 
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
                xhr.send()
            })
        }

        downloadScript(scriptConfig){
            return new Promise((resolve, reject) => {
                let script = document.createElement('script')
                script.onload = function(){
                    resolve()
                }
                script.onerror = function(){
                    reject()
                }
                script.src = scriptConfig.path || scriptConfig
                script.async = !!scriptConfig.async
                document.head.appendChild(script)
            })
        }

    }

    window.LoadScript = LoadScript

})(window);