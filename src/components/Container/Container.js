import React, {Component} from 'react';
import './Container.scss';
import Page from '../Page'

class Container extends Component {
    state = {
        pageOfItems: []
    }
    onChangePage = pageOfItems => {
        this.setState({
            pageOfItems
        });
    };

    render() {
        return (
            <div className="container">
                <div className="header">
                    <h2>Pagination2</h2>
                </div>
                <div className="item_list">
                    {this.state.pageOfItems.map(item => (
                        <div key={item.id}> {item.id + " : " + item.name} </div>
                    ))}
                </div>
                <Page onChangePage={this.onChangePage} />
            </div>
        );
    }
}

export default Container;