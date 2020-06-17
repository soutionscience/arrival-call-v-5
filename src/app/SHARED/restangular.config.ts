const localApi = 'http://localhost:3000/api'
const remoteApi = 'https://arrival-call-v1.herokuapp.com/api'

export function restangularConfigFactory(RestangularProvider){
    RestangularProvider.setBaseUrl(localApi)
}