import * as React from 'react';
import { Fetch } from 'react-subscribe';
import * as Axios from 'axios';

export async function fetchGQL(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  const token = sessionStorage.getItem('hjadmin_token');
  if (!token) {
    return {
      status: 401,
    };
  }
  const resp = await Axios.post('/admin', json, {
    json: true,
    headers: {
      'x-admin-accesstoken': token,
    },
    validateStatus: status => {
      if (status === 401) {
        sessionStorage.removeItem('hjadmin_token');
      }
      return status < 400;
    },
  });
  if (resp.data.errors) {
    throw new Error(resp.data.errors[0].message);
  }
  return resp;
}

export default function FetchGQL({ query, variables, children }) {
  return (
    <Fetch url={JSON.stringify({ query, variables })} doFetch={fetchGQL}>
      {children}
    </Fetch>
  );
}
