import React, {Component, Fragment} from 'react';
import './Page.scss';

class Page extends Component {
    state = {
        exampleItems: [],
        pager: {
            currentPage: 1,
            pageSize: 6,
            totalItems: null, //전체 데이터 개수
            totalPages: null, //전체 페이지 개수
            startPage: 1,     //페이징바에 보이는 첫번째 페이지 숫자
            endPage: null,    //페이징바에 보이는 마지막 페이지 숫자
            startDataIndex: 0, //현재 페이지에 보여질 첫번째 데이터 인덱스
            endDataIndex: null,//현재 페이지에 보여질 마지막 데이터 인덱스
            pageNums: []     //페이징바에 출려될 페이지 넘버들
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.pager.currentPage === 1) {
    //         this.setPage(1,nextState)
    //     } else {
    //         debugger
    //     }
    //     return true;
    // }

    componentDidMount() {
        this.setAPIData();
    }

    setPage = (page, items) => {
        // console.log("page :", items);
        let pager = this.state.pager;
        let pageInfo = this.getPager(items.length, page, pager);
        if (page < 1 || page > pageInfo.totalPages) return;
        let pageOfItems = items.slice(pageInfo.startIndex, pageInfo.endIndex + 1)
        this.props.onChangePage(pageOfItems)
        this.setState({
            pager: {
                ...this.state.pager,
                currentPage: page,
                totalItems: items.length, //전체 데이터 개수
                totalPages: pageInfo.totalPages, //전체 페이지 개수
                startPage: pageInfo.startPage,     //페이징바에 보이는 첫번째 페이지 숫자
                endPage: pageInfo.endPage,    //페이징바에 보이는 마지막 페이지 숫자
                startDataIndex: pageInfo.startIndex, //현재 페이지에 보여질 첫번째 데이터 인덱스
                endDataIndex: pageInfo.endIndex,//현재 페이지에 보여질 마지막 데이터 인덱스
                pageNums: pageInfo.pages     //페이징바에 출려될 페이지 넘버들
            }
        })
    }
    getPager = (totalItemsLength, currentPage, pager) => {
        let totalPages = Math.ceil(totalItemsLength / pager.pageSize);
        let startPage, endPage; // 화면에 보여질 시작페이지, 끝페이지 넘버
        let startIndex, endIndex, pages;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage % 5 !== 0) {
                startPage = currentPage - (currentPage % 5) + 1;
                endPage = currentPage - (currentPage % 5) + 5;
            } else {
                startPage = currentPage - 5 + 1;
                endPage = currentPage
            }
        }
        startIndex = (currentPage - 1) * pager.pageSize;
        endIndex = Math.min(startIndex + pager.pageSize - 1, totalItemsLength - 1);
        pages = [...Array(endPage + 1 - startPage).keys()].map(i => startPage + i);
        return {
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        }
    }
    setAPIData = async () => {
        let data = await this.callAPIData();
        this.setState({
            exampleItems: data
        }, () => {
            this.setPage(1, this.state.exampleItems)
        })
    }
    callAPIData = () => {
        return fetch('https://jsonplaceholder.typicode.com/comments')
            .then(response => response.json())
    }

    render() {
        // console.log("render")
        // console.log("state :", this.state)
        let pager = this.state.pager;
        return (
            <div className="pagination">
                <ul className="pages-box">
                    <li className="page-box" onClick={() => {
                        this.setPage(1, this.state.exampleItems)
                    }}>
                        <a>First</a>
                    </li>
                    <li className="page-box" onClick={() => {
                        this.setPage(pager.startPage - 1, this.state.exampleItems);
                    }}>
                        <a>Prev</a>
                    </li>
                    {pager.pageNums.length !== 0
                        ? pager.pageNums.map((page, index) => {
                            return (
                                <Fragment key={index}>
                                    {page <= pager.totalPages
                                        ? (
                                            <li className="page-box" onClick={() => {
                                                this.setPage(page, this.state.exampleItems)
                                            }}>
                                                <a className={pager.currentPage === page ? "active" : ""}>{page}</a>
                                            </li>
                                        )
                                        : null
                                    }
                                </Fragment>
                            )
                        })
                        : null
                    }
                    <li className="page-box" onClick={() => {
                        this.setPage(pager.endPage + 1, this.state.exampleItems);
                    }}>
                        <a>Nexy</a>
                    </li>
                    <li className="page-box" onClick={() => {
                        this.setPage(pager.totalPages, this.state.exampleItems)
                    }}>
                        <a>Last</a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Page;