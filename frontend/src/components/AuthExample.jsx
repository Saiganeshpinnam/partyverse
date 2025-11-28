import React, {useState} from 'react';
import { register, login } from '../api/auth';

export default function AuthExample() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      if (mode==='register') {
        const res = await register({name,email,password});
        localStorage.setItem('token', res.token);
        setMsg('Registered and logged in as ' + res.user.name);
      } else {
        const res = await login({email,password});
        localStorage.setItem('token', res.token);
        setMsg('Logged in as ' + res.user.name);
      }
    } catch (err) {
      setMsg(err.data?.error || JSON.stringify(err));
    }
  };

  return (
    <div style={{padding:20, maxWidth:420}}>
      <h3>{mode==='register' ? 'Register' : 'Login'}</h3>
      {mode==='register' && <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />}
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={handle}>{mode==='register' ? 'Register' : 'Login'}</button>
      <div style={{marginTop:10}}>
        <button onClick={()=> setMode(mode==='register'?'login':'register')}>Switch to {mode==='register'?'Login':'Register'}</button>
      </div>
      <div style={{marginTop:10, color:'green'}}>{msg}</div>
    </div>
  );
}
