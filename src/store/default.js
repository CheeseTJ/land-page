import { makeAutoObservable,} from "mobx";

//       配置监听      ， 计算属性，方法， 异步方法， 监听
class Store {
    isEN = navigator.language.startsWith("en");
    showBg = JSON.parse(localStorage.getItem("showBg") ?? 'true');
    constructor() {
        makeAutoObservable(this)
    }
    setIsEN(value) {
        this.isEN = value;
        return this.isEN;
    }
    setShowBg() {
        this.showBg=!this.showBg;
        return this.showBg;
    }
}

export const store = new Store()