import { pessoas } from './../type/pessoas';
import request from '../utils/request'

export function getPessoastList(params: Params): Promise<any> {
  return request({
    url: '/api/posts/all',
    method: 'get',
    params
  })
}

// busca no backend os dados cadastrais de pessoas
export function addPessoa(data: pessoas): Promise<any> {
  return request({
    url: '/api/posts/create',
    method: 'POST',
    data
  })
}

export function getPessoasSearch(params: Params): Promise<any> {
  return request({
    url: '/api/posts/search',
    method: 'POST',
    params
  })
}

// envia os dados cadastrais para alteracao
export function editPessoa(data: pessoas): Promise<any> {
  const { id } = data
  return request({
    url: `/api/post/update/${id}`,
    method: 'PUT',
    data
  })
}

// envia o id para exclusao do banco de dados
export function delReceipt(id: number): Promise<any> {
  return request({
    url: `/api/post/delete/${id}`,
    method: 'DELETE'
  })
}

const receiptApi = {
  getPessoastList,
  addPessoa,
  editPessoa,
  delReceipt,
  getPessoasSearch
}

export default receiptApi