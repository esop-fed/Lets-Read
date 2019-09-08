/**
 * 基于require
 */
/*
import { Component } from 'react';

class Bundle extends Component {
    constructor() {
        super();
        this.state = { mod: null };
    }

    componentDidMount() {
        this.props.load((mod) => {
            this.setState({ mod: mod.default || mod });
        });
    }

    render() {
        return (this.state.mod ? this.props.children(this.state.mod) : null);
    }
}

export default Bundle;
*/


/**
 * 基于import（）
 */
/*
import { Component } from 'react';

class Bundle extends Component {
    constructor() {
        super();
        this.state = { mod: null };
    }

    async componentDidMount() {
        const { default: mod } = await this.props.load();
        this.setState({ mod: mod.default || mod });
    }

    render() {
        return (this.state.mod ? this.props.children(this.state.mod) : null);
    }
}

export default Bundle;
*/

/**
 * 基于import()
 * 用于react router4 code splitting
 * */

/**
 * @param {Function} loadComponent e.g: () => import('./component')
 * @param {ReactNode} placeholder 未加载前的占位
 */

import React, { Component } from 'react';

export default (loadComponent, placeholder = null) => {
    class AsyncComponent extends Component {
        unmount = false;

        constructor() {
            super();
            this.state = { component: null };
        }

        componentWillUnmount() {
            this.unmount = true;
        }

        async componentDidMount() {
            const { default: component } = await loadComponent();
            if (!this.unmount) {
                return this.setState({ component: component });
            }
        }

        render() {
            const C = this.state.component;
            return (C ? <C {...this.props}></C> : placeholder);
        }
    }

    return AsyncComponent;
};

