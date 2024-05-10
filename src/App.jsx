import './App.scss'
import Header from './pages/header/header.jsx'
import Content from './pages/content/content.jsx'
import Footer from './pages/footer/footer.jsx'
import {Component} from "react";
import {store} from "./store/default.js";
import {reaction} from "mobx";

class App extends Component {
    constructor(props) {
        super(props);
        this.imgs = [];
        this.state = {
            bgImg: "",
            imgLoaded: true,
            showBg: store.showBg,
            newInx:null
        };
        // methods
        this.getImgs=()=> {
            let cacheImgs = localStorage.getItem("bgImgs");
            if (cacheImgs) {
                this.imgs = JSON.parse(cacheImgs);
                this.setState({
                    bgImg: this.setImg()
                })
                return;
            }
            fetch('/public/export_urls.csv').then(res => res.text()).then(data => {
                this.imgs = data.split('\n').map(i => i.split(',')[1].replaceAll('"', ""))
                this.imgs.shift()
                this.setState({
                    bgImg: this.setImg()
                })
                localStorage.setItem('bgImgs', JSON.stringify(this.imgs))
            })
        }
        this.setImg = () => {
            let lockInx = localStorage.getItem("lockInx");
            if (lockInx) {
                return this.imgs[lockInx]
            }
            let nowInx = localStorage.getItem('nowInx')
            if (nowInx && new Date().getDate() == nowInx.split(',')[1]) {
                return this.imgs[nowInx.split(',')[0]]
            }
            let newInx = this.getRandomInx();
            this.setState({newInx})
            localStorage.setItem('nowInx', newInx + ',' + new Date().getDate());
            return this.imgs[newInx]
        }
        this.refreshImg = () => {
            localStorage.removeItem('nowInx');
            localStorage.removeItem('lockInx');
            this.setState({
                bgImg:this.setImg()
            } )
        }
        // computed
        this.getRandomInx = () => Math.round(Math.random() * this.imgs.length);
        // watch
        reaction(() => store.showBg, (nval, oval) => {
            nval && this.getImgs();
            this.setState({
                showBg: nval
            })
        })
    }
    // init
    componentDidMount() {
        this.state.showBg && this.getImgs();
    }

    render() {
        return (
            // <div id="App" style={{backgroundImage: `url(${this.state.bgImg})`}}>
            <div id="App">
                <img id='bgImg' draggable={false}
                     style={{opacity: this.state.showBg ? 1 : 0, pointerEvents: this.state.showBg ? 'all' : 'none'}}
                     src={this.state.bgImg} alt=""/>
                <Header></Header>
                <Content newInx={this.state.newInx} refreshImg={this.refreshImg}></Content>
                <Footer></Footer>
            </div>
        )
    }
}

export default App
