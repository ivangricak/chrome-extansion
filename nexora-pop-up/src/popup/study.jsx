// import React from 'react'
// import Header from './components/header'
// import UserLogin from './components/auth/LoginForm'
// import './Popup.css'

// class Popup extends React.Component {
//   constructor(props) {
//     super(props) 
//       this.state = {
//         helpText: "You get help!",
//         userData: "",
//         colorChange: "white"
//     }
//     this.inputClick = this.inputClick.bind(this)
//     this.mouseOver = this.mouseOver.bind(this)
//   }

//   render() {
//     return (
//       <main>
//         <UserLogin />
//         {/* <Header title="The Header" />
//         <h3>{this.state.helpText}</h3>
//         <h5>{this.state.userData}</h5>
//         <input style={{backgroundColor: this.state.colorChange === "black" ? "white" : "black"}}
//           placeholder={this.state.helpText} 
//           onChange={event => this.setState({userData: event.target.value})}
//           onClick={this.inputClick} 
//           onMouseOver={this.mouseOver} 
//         />
//         <p>{this.state.helpText === "You get help!" ? "Yes" : "No"}</p> */}
//       </main>
//     )
//   }
//   inputClick() {
//     this.setState({helpText: "Changed"})
//     console.log("Clicked")
//   }
//   mouseOver() {
//     this.setState({colorChange: "black"})
//     console.log("Moused Over")
//   }
// }

// export default Popup