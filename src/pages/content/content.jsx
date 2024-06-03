import {Component} from "react";
import './content.scss';
import {gsap} from 'gsap';
import { reaction} from "mobx";
import {store} from "../../store/default.js";
import TButton from "../../components/TButton/TButton.jsx";
import personSvg from '../../assets/person.svg'
import whiteBgSvg from '../../assets/whiteBg.svg'
export default class content extends Component {
    constructor(props) {
        super(props);
        this.svgDom = null;
        this.searchList = [{
            title: {
                en: 'Baidu',
                zh: '百度'
            },
            icon: 'baidu',
            url: 'https://www.baidu.com/s?wd=',
            placeholder: {
                en: 'Type here...',
                zh: '百度一下'
            }
        }, {
            title: {
                en: 'IconFinder',
                zh: 'IconFinder'
            },
            icon: 'find',
            url: 'https://www.iconfinder.com/search?q=',
            placeholder: {
                en: 'You can search for icons here...',
                zh: '在这里搜索图标...'
            }
        }, {
            title: {
                en: 'Pexels',
                zh: 'Pexels'
            },
            icon: 'find',
            url: 'https://www.pexels.com/search/',
            placeholder: {
                en: 'You can search for Copyright-free images  here...',
                zh: '在这里搜索无版权的图片...'
            }
        }, {
            title: {
                en: 'Bing',
                zh: '必应'
            },
            icon: 'biying',
            url: 'https://cn.bing.com/search?q=',
            placeholder: {
                en: 'Type here...',
                zh: '必应一下'
            }
        }, {
            title: {
                en: 'Google',
                zh: '谷歌'
            },
            icon: 'google',
            url: 'https://www.baidu.com/s?wd=',
            placeholder: {
                en: 'Type here...',
                zh: '谷歌一下'
            }
        },]
        this.settingList = [{
            title: {
                en: 'Show Background',
                zh: '背景显示'
            },
            prop:'setShowBg',
            value:store.showBg,
            type:'btn'
        },{
            title: {
                en: 'Show ImgControler always',
                zh: '常显图片控件'
            },
            prop:'setShowControl',
            value:store.showControl,
            type:'btn'
        }]
        this.mask = null;
        this.trans = ['.color1', '.color2', '.color3', '.icon-shezhi'];
        this.bgImg = null;
        this.state = {
            flag: true,
            selInx: 0,
            selItem: this.searchList[0],
            keyWord: '',
            isEN: store.isEN,
            lockInx:JSON.parse(localStorage.getItem("lockInx")??'null'),
            showControl:store.showControl,
            showSetting:false
        }
        this.watchList = ['showBg','isEN','showControl']
        //methods
        this.bindSvg = (e) => {
            this.svgDom = e.target.contentDocument.querySelector('#person')
        }
        this.changeFocus = (isFocus) => {
            this.svgDom.classList[isFocus ? 'add' : 'remove']('act');
        }
        this.pressEnter = e => {
            this.setState({
                keyWord: e.target.value
            })
            if (e.key !== 'Enter') return;
            setTimeout(this.doSearch)
        }
        this.handleLock=(lock)=>{
            if(lock){
                let nowInx = localStorage.getItem('nowInx').split(',')[0];
                localStorage.setItem('lockInx',nowInx);
                this.setState({
                    lockInx:nowInx
                })
            }else{
                localStorage.removeItem('lockInx');
                this.setState({
                    lockInx:null
                })
            }
        }
        this.showSearchList = (isOpen = true) => {
            const searchList = document.querySelector('.searchList');
            searchList.classList[isOpen ? 'add' : 'remove']('act')
        }
        this.initSearchMask = () => {
            this.mask = document.querySelector('.searchItemMask');
            const selectItem = document.querySelector('.searchItem.act');
            setTimeout(() => {
                this.mask.style.width = selectItem.clientWidth + 'px';
                this.mask.style.height = selectItem.offsetHeight + 'px';
                let left = selectItem.offsetLeft;
                let top = selectItem.offsetTop;
                this.moveMask(left, top)
            }, 200)

        }
        this.changeSearch = (info, inx, e) => {
            console.log(this.setImg)
            this.setState({
                selInx: inx,
                selItem: info,
            })
            let {offsetLeft: left, offsetTop: top} = e.target;
            this.moveMask(left, top)
        }
        this.moveMask = (left, top) => {
            this.mask.style.left = left + 'px';
            this.mask.style.top = top + 'px';
        }
        this.doSearch = () => {
            window.open(this.state.selItem.url + this.state.keyWord)
            this.setState({
                keyWord: ''
            })
        }
        this.showBg = (e) => {
            if(this.state.showSetting){
                this.setState({
                    showSetting:false
                })
                return
            }
            gsap.to('.person', {y: '100%', duration: .7})
            gsap.to('.whiteBg', {x: 800, y: -800, duration: .7})
            gsap.to('#header', {top: -100, duration: 1})
            gsap.to('.search', {z: -100, opacity: 0, duration: .3});
            gsap.to('.lockArea', {y:-100, duration: .5,delay:.3,onComplete:()=>{
                    gsap.to('.lockArea', {y:0, duration: .5,delay:2.3});
            }});
            this.state.showControl || gsap.to('.bgBtn',{y:-100,duration:.5});
            this.trans.forEach(i => {
                gsap.to(i, {x: this.randomPx(), y: this.randomPx(), scale: this.randomSize(), opacity: 0, duration: 1});
            })
        }
        this.hideBg = () => {
            gsap.to('.person', {y: 0, duration: .7})
            gsap.to('.whiteBg', {x: 0, y: 0, duration: .7})
            gsap.to('#header', {top: 0, duration: 1})
            gsap.to('.search', {z: 0, opacity: 1, duration: .3,onComplete:()=>{
                    document.querySelector('.search').style='';
            }})
            gsap.to('.lockArea', {y:0, duration: .5,delay:.3});
            this.state.showControl ||gsap.to('.bgBtn',{y:0,duration:.5});
            this.trans.forEach(i => {
                gsap.to(i, {x: 0, y: 0, scale: 1, opacity: 1, duration: 1});
            })
        }
        this.initPress = () => {
            this.bgImg.addEventListener('mousedown', this.showBg);
            this.bgImg.addEventListener('mouseup', this.hideBg);
        }
        this.removePress = () => {
            this.bgImg.removeEventListener('mousedown', this.showBg)
            this.bgImg.removeEventListener('mouseup', this.hideBg)
        }
        this.btnClick = (settingItem) =>{
            let nval = store[settingItem.prop](settingItem.value);
            settingItem.value = nval;
            localStorage.setItem('showBg',nval)
        }
        this.toggleSettingShow = () =>{
            this.setState({
                showSetting:!this.state.showSetting
            })
        }
        // computed
        this.i18n = (obj) => obj[this.state.isEN ? 'en' : 'zh'];
        this.isLock = () =>this.state.lockInx ?? false;
        this.randomPx = () => (Math.round(Math.random() * 500) + 100) * (Math.round(Math.random()) ? 1 : -1);
        this.randomSize = () => (Math.round(Math.random() * 20) / 10);
        // watch
        reaction(() => this.watchList.map(i=>store[i]), (nval) => {
            let nstate={}
            this.watchList.forEach((i,inx)=>{
               nstate[i]=nval[inx]
            })
            this.setState(nstate);
        })
    }

    componentDidMount() {
        this.bgImg = document.querySelector('#bgImg');
        this.initSearchMask();
        this.initPress()
    }

    render() {
        return (
            <div className="content">
                <div className="customArea">
                </div>
                <div className="searchBox">
                    <div className='colorSpan'>
                        <span className="color1"></span>
                        <span className="color2"></span>
                        <span className="color3"></span>
                        <i className="iconfont icon-shezhi" onClick={this.toggleSettingShow}></i>
                    </div>

                    <object data={personSvg} className="person" onLoad={this.bindSvg}
                            type="image/svg+xml">
                    </object>
                    <div className="search">
                        <div className="searchList" onMouseLeave={() => this.showSearchList(false)}>
                            <div className="searchItemMask"></div>
                            {this.searchList.map((i, inx) =>
                                <div key={inx} className={`searchItem ${this.state.selInx === inx ? 'act' : ''}`}
                                     onClick={(e) => this.changeSearch(i, inx, e)}><i
                                    className={`iconfont searchLogo icon-${i.icon}`}></i> {this.i18n(i.title)}</div>
                            )}
                        </div>
                        <i className={`iconfont searchLogo icon-${this.state.selItem.icon}`}
                           onClick={this.showSearchList}></i>
                        <input type="text" onFocus={() => this.changeFocus(true)} onBlur={() => this.changeFocus(false)}
                               onKeyDown={this.pressEnter} placeholder={this.i18n(this.state.selItem.placeholder)}/>
                        <i className="iconfont icon-sousuo" onClick={this.doSearch}></i>
                    </div>
                    <img src={whiteBgSvg} draggable={false} className='whiteBg' alt=''/>
                </div>
                <div className="lockArea">
                    {this.i18n({en: 'Drag here to lock', zh: '拖动这里锁定图片'})}
                </div>
                <div className={`settingList ${this.state.showSetting ? 'act' : ''}`}>{
                    this.settingList.map((i, inx) => <div key={inx} className={'settingItem'}>
                        <span>{this.i18n(i.title)}</span>
                        <TButton value={i.value} handleClick={() => this.btnClick(i)}></TButton>
                    </div>)
                }</div>
                <div className={`bgBtn ${this.state.showControl?'alwaysShow':''}`}>
                    <i className={`iconfont ${this.isLock() ? 'icon-suoding' : 'icon-jiesuo'}`}
                       onClick={() => this.handleLock(!this.isLock())}></i>
                    <i className="iconfont icon-shuaxin" onClick={this.props.refreshImg}></i>
                    <i className="iconfont icon-xiazai" onClick={this.props.downloadBgImg}></i>
                </div>
            </div>
        )
    }
}