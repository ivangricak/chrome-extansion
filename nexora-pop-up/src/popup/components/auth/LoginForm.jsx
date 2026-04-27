import React from 'react'
import '../../css/auth.css'

class UserLogin extends React.Component {

    state = {
        login: '',
        password: '',
        error: null,
        userId: null
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    componentDidMount() {
        chrome.storage.local.get(["token", "userId"], ({ token, userId }) => {
            console.log(userId);
            if(token) {
                this.props.switchAcceptionLogin();
            }
        });
      }

    handleLogin = () => {
        const { login, password } = this.state;

        fetch("https://wet-saver-production.up.railway.app/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password })
        })
        .then(async res => {
            const data = await res.json()
            return data
        })
        .then(data => {
            console.log(data.token + " showed")
            if (data.token) {
                chrome.storage.local.set({ token: data.token, userId: data.user }, () => {
                });
                this.props.switchAcceptionLogin();
            } else {
                this.setState({ error: "Login failed" });
            }
        })
        .catch(err => {
            console.error('[SERVER ERROR]', err)
            this.setState({ error: "Server error" })
        })
    }

    render () {
        return (
            <main>
                <div className='duo'>
                    <div className='inputLogin'>
                        <label>Login</label>
                        <input 
                            type="text"
                            name="login"
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className='inputLogin'>
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />
                    </div>
                </div>

                {this.state.error && <p>{this.state.error}</p>}

                <div className='kontrol'>
                    <button 
                        className='buttonLogin'
                        onClick={this.handleLogin}
                    >
                        Apply
                    </button>

                    <button 
                        className='reg-btn-log'
                        onClick={this.props.switchToRegister}
                    >
                        Register
                    </button>
                </div>
            </main>
        )
    }
}

export default UserLogin