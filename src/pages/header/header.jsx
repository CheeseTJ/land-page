import {Component} from "react";
import './header.scss'
import {gsap} from "gsap";
import {store} from "../../store/default.js";
export default class content extends Component {
    constructor(props) {
        super(props);
        this.en = "M827.733333 729.6h-81.066666v-157.866667c0-34.133333 0-55.466667-4.266667-64-4.266667-8.533333-8.533333-17.066667-17.066667-21.333333-8.533333-4.266667-17.066667-8.533333-29.866666-8.533333-12.8 0-25.6 4.266667-38.4 12.8-12.8 8.533333-21.333333 17.066667-21.333334 29.866666-4.266667 12.8-4.266667 38.4-4.266666 72.533334v140.8h-81.066667V413.866667h76.8v46.933333c25.6-34.133333 59.733333-51.2 102.4-51.2 17.066667 0 34.133333 4.266667 51.2 8.533333 17.066667 8.533333 25.6 17.066667 34.133333 25.6 8.533333 8.533333 12.8 21.333333 17.066667 34.133334 4.266667 12.8 4.266667 29.866667 4.266667 55.466666l-8.533334 196.266667z m-652.8 0V294.4h320v72.533333H264.533333v93.866667h217.6v72.533333H264.533333v119.466667h243.2V725.333333l-332.8 4.266667z"
        this.zh = "M477.866667 209.066667h68.266666v110.933333h230.4v315.733333h-68.266666v-34.133333h-162.133334v217.6h-68.266666v-217.6H315.733333v34.133333H247.466667V320h230.4V209.066667z m-162.133334 324.266666h162.133334V384H315.733333v149.333333z m230.4 0h162.133334V384h-162.133334v149.333333z"
        this.state = {
            isEN: store.isEN,
            actMenu: 0,
        }
        this.menuList = [{
            title: {
                en: 'Home',
                zh: '首页'
            },
            path: '/',
        }, {
            title: {
                en: 'Demos',
                zh: '作品'
            },
            path: '/demos',
        }, {
            title: {
                en: 'Blog',
                zh: '博客'
            },
            url: 'http://blog.june-t.top'
        }]
        // methods
        this.changeLang = () => {
            store.setIsEN(!this.state.isEN)
            this.setState({
                isEN: !this.state.isEN
            }, () => {
                gsap.to('#show', {
                    duration: .5,
                    attr: {
                        d: this.state.isEN ? this.en : this.zh
                    }
                })
            })
        }
        this.initSvg = () => {
            let show = document.querySelector('#show');
            show.setAttribute('d', this.state.isEN ? this.en : this.zh)
        }
        this.changeMenu = (inx) => {
            if (inx === this.state.actMenu) return;
            this.setState({
                actMenu: inx
            })
        }
        // computed
        this.i18n = (obj) => obj[this.state.isEN?'en':'zh'];
    }

    componentDidMount() {
        this.initSvg();
    }

    render() {
        return (
            <div id="header">
                <div className="menu">
                    {this.menuList.map((i, inx) =>
                        <div key={inx} className={`menuItem ${inx === this.state.actMenu ? 'act' : ''}`}
                             onClick={() => this.changeMenu(inx)}>{this.i18n(i.title)}</div>
                    )}
                    <div className="menuItem" onClick={this.changeLang}>
                        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 921.6V102.4C0 46.933333 46.933333 0 102.4 0h819.2C977.066667 0 1024 46.933333 1024 102.4v819.2c0 55.466667-46.933333 102.4-102.4 102.4H102.4C46.933333 1024 0 977.066667 0 921.6z m947.2 0V102.4c0-12.8-12.8-25.6-25.6-25.6H102.4c-12.8 0-25.6 12.8-25.6 25.6v819.2c0 12.8 12.8 25.6 25.6 25.6h819.2c12.8 0 25.6-12.8 25.6-25.6z"
                                fill="#409EFF"></path>
                            <path
                                id='show'
                                fill="#409EFF"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}