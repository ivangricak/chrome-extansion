import React from 'react'
import './Popup.css'

import UserLogin from './components/auth/LoginForm'
import UserRegister from './components/auth/RegisterForm'
import Home from './components/private/home'
import Header from './components/header'
import Online from './components/online/Online'
import Profile from './components/private/profile/Profile'
import OnlineProfile from './components/online/profile/Profile'

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeForm: "login",
            accept: false,
            title: "Home",
            owner: null,
            user: null
        }

        this.OpenLogin = this.OpenLogin.bind(this)
        this.OpenRegister = this.OpenRegister.bind(this)
        this.AcceptionLogin = this.AcceptionLogin.bind(this)
        this.OpenOnline = this.OpenOnline.bind(this)
        this.OpenProfile = this.OpenProfile.bind(this)
        this.OpenOnlineProfile = this.OpenOnlineProfile.bind(this)
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
    OpenProfile(owner) {
        this.setState({activeForm: "profile", owner})
    }
    OpenOnlineProfile(owner) {
        this.setState({activeForm: "onlineProfile", owner})
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

    componentDidMount() {
        chrome.storage.local.get("userId", ({ userId }) => {
            console.log('iDD: ', userId);
            this.setState({ owner: userId, user: userId });
        });
    }
    
    render() {
        const { activeForm, owner, user } = this.state;

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
                <UserRegister 
                    switchToLogin={this.OpenLogin}
                    switchAcceptionLogin={this.AcceptionLogin}
                />
            );
        }
    
        if (activeForm === "home") {
            return (
                <>
                    <Header
                        user={user}
                        owner={owner}
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
                        user={user}
                        owner={owner}
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <Online 
                        switchToOpenProfile={this.OpenProfile}
                        switchToOpenOnlineProfile={this.OpenOnlineProfile}
                    />
                </>
            )
        }

        if (activeForm === "profile") {
            return (
                <>
                    <Header 
                        user={user}
                        owner={owner}
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <Profile
                        owner={owner}
                    />
                </>
            )
        }

        if (activeForm === "onlineProfile") {
            return (
                <>
                    <Header 
                        user={user}
                        owner={owner}
                        title={this.props.title}
                        switchToOpenOnline={this.OpenOnline}
                        switchToOpenProfile={this.OpenProfile}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                    />
                    <OnlineProfile
                        owner={owner}
                    />
                </>
            )
        }
    
        return null;
    }
  }

export default Popup