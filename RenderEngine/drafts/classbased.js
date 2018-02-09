class Component {
    constructor(props) {
        this.$ = {};
        Object.keys(props || {}).forEach(k => this.$[k] = props[k]);
    }

    loop(arr, templ) {
        return (arr || []).map((x, i) => new templ({ ...x, index: i })).join('');
    }

    if(cond, templ, data) {
        return cond ? new templ(data) : ''
    }

    toString() { return '' }
}

class Pet extends Component {
    toString() {
        return `<li>${this.$.index} You have a ${this.$.type} called ${this.$.name}</li>`;
    }
}

class Test extends Component {
    toString() {
        return `yoyo ${this.$.name}`;
    }
}

class App extends Component {
    toString() {
        return `
            Hello ${this.$.name}
            <ul>${this.loop(this.$.pets, Pet)}</ul>
            ${this.if(true, Test, this.$.pets[1])}
        `;
    }
}

let data = { name: 'John', pets: [{ type: 'cat', name: 'William' }, { type: 'dog', name: 'Rupert' }] };
document.body.innerHTML = new App(data);