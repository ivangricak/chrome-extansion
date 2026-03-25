import React from 'react'
import '../../css/auth.css'

class UserRegister extends React.Component {

    render () {
        return (
            <>
                <main>
                    <div className='duo'>
                        <div className='inputLogin'>
                            <label htmlFor="login">Login</label>
                            <input type="text" id='login' name='login'/>
                        </div>
                        <div className='inputLogin'>
                            <label htmlFor="login">Name</label>
                            <input type="text" id='login' name='login'/>
                        </div>
                        <div className='inputLogin'>
                            <label htmlFor="password">Password</label>
                            <input type="text" id='password' name='password'/>
                        </div>
                        <div className='inputLogin'>
                            <label htmlFor="password">Confirm Password</label>
                            <input type="text" id='password' name='password'/>
                        </div>
                    </div>
                    <div className='kontrol'>
                        <button className='buttonLogin' onClick={this.props.switchAcceptionLogin}>Apply</button>

                        <button className='reg-btn-log' onClick={this.props.switchToLogin}>Log-in</button>
                    </div>
                </main>
            </>
        )
    }

}

export default UserRegister