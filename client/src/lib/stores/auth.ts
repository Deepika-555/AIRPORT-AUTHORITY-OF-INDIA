import {writable} from 'svelte/store';
import client from '$lib/interceptors/client';
import { goto } from '$app/navigation';


export const authenticated = writable(false);

export const currentUser =  writable();

export async function onRefresh() {
  const {data, status} = await client.get('refresh', {withCredentials: true});


  if (status === 200) {
    client.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    authenticated.set(true);
  
    const response: any = await client.get('user', {withCredentials: true});
    currentUser.set(response.data);
  }
}

export async function logout() {
    const res = await client.post('logout', {}, {withCredentials: true});
    // const res = await cl.post('http://localhost:9000/api/logout', {}, {withCredentials: true});
    client.defaults.headers.common['Authorization'] = '';
    authenticated.set(false);
    goto('/');
   
  }