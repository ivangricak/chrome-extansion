import React from 'react'

class Header extends React.Component {
    render() {
        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={this.props.switchAcceptionLogin} >
                            Nexora
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" onClick={this.props.switchAcceptionLogin}>Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={this.props.switchToOpenOnline}>Online</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => this.props.switchToOpenProfile(this.props.user)}>Profile</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link">Main</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Auth
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <li>
                                            <a className="dropdown-item" onClick={this.props.switchToRegister}>Login/Register</a>
                                        </li>
                                        <li>
                                            <form>
                                                <button className="dropdown-item" type="submit" onClick={this.props.switchToLogOut}>Logout</button>
                                            </form>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header