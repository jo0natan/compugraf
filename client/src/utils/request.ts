import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { generateIVFromString, JonatanVillelaEncrypt } from './encryption';



// Criando uma instância do axios
const service = axios.create({
  baseURL: (import.meta as ImportMeta).env.VITE_APP_BASE_API
})

// Interceptador de requisição
service.interceptors.request.use(
  
  (config: AxiosRequestConfig) => {
    const method = config?.method?.toLocaleLowerCase() ?? ''
    if (['post', 'put'].includes(method)) {
      if (config.headers) {
        config.headers['Content-Type'] = 'application/json'
      }
    }
    
    return config
  },
  (error) => {
    //erro de requisição
    Promise.reject(error)
  }
)


service.interceptors.request.use(async config => {
  
  const timestamp = new Date().getTime();
  let getiv =  await generateIVFromString(timestamp);
  const password = (import.meta as ImportMeta).env.VITE_PASSWORD
  
  // @ts-ignore
  const key = await JonatanVillelaEncrypt(timestamp.toString()+"--JonatanSEC", password, getiv);

  config.headers = {
    'jonatansec': key.encryptedData,
    'timestamp': timestamp,
  };
  
  return config;
});
// Interceptador de resposta
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status, config, headers, statusText } = response
    if (status < 200 || status > 300) {

      ElMessage({
        message: statusText,
        type: 'error',
        duration: 10 * 1000
      })
    } else {
      const action = getAction(config, status)
      if (action) {
       /* ElMessage({
          message: action + ' com sucesso',
          type: 'success'
        })*/
      }
      const count = headers['x-total-count']
      if (count) {
        return {
          lista: data,
          total: parseInt(count)
        }
      }
      return data
    }
  },
  (error) => {
    ElMessage({
      message: error.message ?? 'Erro desconhecido',
      type: 'error',
      duration: 10 * 1000
    })
    return Promise.reject(error.code)
  }
)

function getAction(config: AxiosRequestConfig, status: number) {
  let action = ''
  if (status === 201) {
    action = 'Adicionar'
  } else {
    const method = config?.method?.toLocaleLowerCase() ?? ''
    if (method === 'put') {
      action = 'Alteração de dados realizada '
    } else if (method === 'delete') {
      action = 'Excluir'
    }
  }
  return action
}
export default service