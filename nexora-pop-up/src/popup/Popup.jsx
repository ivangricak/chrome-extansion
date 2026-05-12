import React from 'react'
import './Popup.css'

import UserLogin from './components/auth/LoginForm'
import UserRegister from './components/auth/RegisterForm'
import Home from './components/private/home'
import Header from './components/header'
import Online from './components/online/Online'
import Profile from './components/private/profile/Profile'
import OnlineProfile from './components/online/profile/Profile'
import Test from './components/test/Test'
import FastView from './components/private/FastView'
import { NavbarFastView } from './components/Navbar'

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

        this.OpenHome = this.OpenHome.bind(this)
        this.OpenLogin = this.OpenLogin.bind(this)
        this.OpenRegister = this.OpenRegister.bind(this)
        this.AcceptionLogin = this.AcceptionLogin.bind(this)
        this.OpenOnline = this.OpenOnline.bind(this)
        this.OpenProfile = this.OpenProfile.bind(this)
        this.OpenOnlineProfile = this.OpenOnlineProfile.bind(this)
        this.AcceptionLogOut = this.AcceptionLogOut.bind(this)
        this.OpenMainPage = this.OpenMainPage.bind(this)
        this.OpenTest = this.OpenTest.bind(this)
        this.OpenFastView = this.OpenFastView.bind(this)
    }
    
    OpenLogin() {
        this.setState({activeForm: 'login'})
    }
    OpenRegister() {
        this.setState({activeForm: 'register'})
    }
    AcceptionLogin() {
        chrome.storage.local.get(["activeForm"], (result) => {
            {result.activeForm === 'fastView' ? this.setState({activeForm: "fastView"}) : this.setState({activeForm: 'home'}) }
        });
    }
    OpenHome() {
        chrome.storage.local.set({"activeForm": "home"});
        this.setState({activeForm: "home"}) 
    }
    OpenOnline() {
        chrome.storage.local.set({"activeForm": "home"});
        this.setState({activeForm: "online"})
    }
    OpenProfile(owner) {
        chrome.storage.local.set({"activeForm": "home"});
        this.setState({activeForm: "profile", owner})
    }
    OpenOnlineProfile(owner) {
        chrome.storage.local.set({"activeForm": "home"});
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
        chrome.storage.local.remove(["token", "activeForm", "userId", "token"]);
        this.setState({ activeForm: "login" });
    }

    OpenFastView() {
        chrome.storage.local.set({"activeForm": "fastView"});
        this.setState({activeForm: "fastView"});
    }

    OpenMainPage() {
        console.log('open main page: ');
        chrome.tabs.create({
            url: 'https://wet-saver-production.up.railway.app'
        });
    }

    OpenTest() {
        this.setState({activeForm: "test"})
    }

    componentDidMount() {
        chrome.storage.local.get(["activeForm", "userId"], (result) => {
            const newState = {
                owner: result.userId,
                user: result.userId
            };
    
            if (result.activeForm) {
                if (result.activeForm === "fastView") {
                    newState.activeForm = "fastView";
                } else {
                    newState.activeForm = "home";
                }
            }
    
            this.setState(newState);
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
                        switchToOpenHome={this.OpenHome}
                        switchToOpenMainPage={this.OpenMainPage}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToRegister={this.OpenRegister}
                        switchToLogOut={this.AcceptionLogOut}
                        switchToOpenTest={this.OpenTest}
                        switchToOpenFastView={this.OpenFastView}
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
                        switchToOpenHome={this.OpenHome}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenMainPage={this.OpenMainPage}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                        switchToOpenTest={this.OpenTest}
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
                        switchToOpenHome={this.OpenHome}
                        switchToOpenOnline={this.OpenOnline}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenMainPage={this.OpenMainPage}
                        switchToOpenProfile={this.OpenProfile}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                        switchToOpenTest={this.OpenTest}
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
                        switchToOpenHome={this.OpenHome}
                        switchToOpenOnline={this.OpenOnline}
                        switchToOpenProfile={this.OpenProfile}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenMainPage={this.OpenMainPage}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                        switchToOpenTest={this.OpenTest}
                    />
                    <OnlineProfile
                        owner={owner}
                    />
                </>
            )
        }

        if (activeForm === "test") {
            return (
                <Test />
            )
        }

        if (activeForm === "fastView") {
            return (
                <>
                    {/* <Header 
                        user={user}
                        owner={owner}
                        title={this.props.title}
                        switchToOpenHome={this.OpenHome}
                        switchToOpenOnline={this.OpenOnline}
                        switchToOpenProfile={this.OpenProfile}
                        switchAcceptionLogin={this.AcceptionLogin}
                        switchToOpenMainPage={this.OpenMainPage}
                        switchToLogin={this.OpenLogin}
                        switchToLogOut={this.AcceptionLogOut}
                        switchToOpenTest={this.OpenTest}
                    /> */}
                    <FastView 
                        switchToOpenHome={this.OpenHome}
                    />
                    {/* <NavbarFastView /> */}
                </>
            )
        }
    
        return null;
    }
  }

export default Popup