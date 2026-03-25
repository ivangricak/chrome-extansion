import React from 'react'
import './Popup.css'

import UserLogin from './components/auth/LoginForm'
import UserRegister from './components/auth/RegisterForm'
import Home from './components/private/home'
import Header from './components/header'
import Online from './components/online/Online'
import Profile from './components/private/profile/Profile'

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeForm: "login",
            accept: false,
            title: "Home"
        }

        this.OpenLogin = this.OpenLogin.bind(this)
        this.OpenRegister = this.OpenRegister.bind(this)
        this.AcceptionLogin = this.AcceptionLogin.bind(this)
        this.OpenOnline = this.OpenOnline.bind(this)
        this.OpenProfile = this.OpenProfile.bind(this)
        this.AcceptionLogOut = this.AcceptionLogOut.bind(this)
    }
    
    OpenLogin() {
        this.setState({activeForm: 'login'})
    }
    OpenRegister() {
        this.setState({activeForm: 'register'})
    }
    AcceptionLogin() {
        this.setState({activeForm: 'home'})
    }
    OpenOnline() {
        this.setState({activeForm: "online"})
    }
    OpenProfile() {
        this.setState({activeForm: "profile"})
    }
    AcceptionLogOut() {
        chrome.storage.local.get("token", ({ token }) => {
            fetch("https://wet-saver-production.up.railway.app/api/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        });
        chrome.storage.local.remove("token");
        this.setState({ activeForm: "login" });
    }

    
    render() {
        const { activeForm } = this.state;
    
        if (activeForm === "login") {
            return (
                <UserLogin 
                    switchToRegister={this.OpenRegister}
                    switchAcceptionLogin={this.AcceptionLogin}
                />
            );
        }

        if (activeForm === "logout") {
            return (
                <UserLogin
                    switchToRegister={this.OpenRegister}
                    switchAcceptionLogin={this.AcceptionLogin}
                />
            )
        }
    
        if (activeForm === "register") {
            return (
                <>
                <UserRegister 
                    switchToLogin={this.OpenLogin}
                    switchAcceptionLogin={this.AcceptionLogin}
                />
                </>
            );
        }
    
        if (activeForm === "home") {
            return (
                <>
                    <Header 
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToRegister={this.OpenRegister}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <Home/>
                </>
            );
        }

        if (activeForm === "online") {
            return (
                <>
                    <Header 
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <Online />
                </>
            )
        }

        if (activeForm === "profile") {
            return (
                <>
                    <Header 
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <Profile/>
                </>
            )
        }
    
        return null;
    }
  }

export default Popup