import {Component} from "react";
import './TButton.scss'
import PropTypes from "prop-types";
export default class TButton extends Component{
    constructor(props) {
        super(props);
        this.fn = ()=>{
            this.props.handleClick();
        }
    }
    render() {
        return <div className={`TButton ${this.props.value?'act':''}`} onClick={this.fn}>
            <div className='Tbtn-slider'></div>
        </div>
    }
}
TButton.propTypes  ={
    handleClick: PropTypes.func.isRequired,
    value:PropTypes.bool.isRequired
}