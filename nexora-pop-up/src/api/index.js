export const login = async (login, password) => {
    const res = await fetch('https://wet-saver-production.up.railway.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });
    return res.json();
  };
  
  export const getUser = async () => {
    const res = await fetch('https://wet-saver-production.up.railway.app/api/user', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Accept': 'application/json',
      },
    });
    return res.json();
  };