import React, {useState} from 'react';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import './Pagination.css';

const PaginationBlock = (props) => {
    let portionSize = 5;
    let pagesCount = Math.ceil(props.totalNotices / props.noticePerPage);

    let pages = [];
    for  (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState(1);
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionPageNumber = portionNumber * portionSize;

    return (
        <div className='pagination-block'>
            <ul className='pagination-block__list'>
                {
                    portionNumber > 1 &&
                    <button className='pagination-block__btn prev-btn' onClick={() => { setPortionNumber(portionNumber - 1 ) }}>
                        <ArrowLeftIcon/>
                    </button>
                }
                {
                    pages
                        .filter(pageNumber => pageNumber >= leftPortionPageNumber && pageNumber <= rightPortionPageNumber)
                        .map(pageNumber => {
                            return (
                                <li
                                    className={`pagination-block__list--item ${props.currentPage === pageNumber ? 'pagination-block__list--item-active' : ''}`}
                                    key={pageNumber}
                                    onClick={() => props.onPageChanged(pageNumber)}
                                >
                                    {pageNumber}
                                </li>
                            )
                        })
                }
                {
                    portionCount > portionNumber &&
                    <button className='pagination-block__btn next-btn' onClick={() => { setPortionNumber(portionNumber + 1) }}>
                        <ArrowRightIcon/>
                    </button>
                }
            </ul>
        </div>
    );
};

export default PaginationBlock;
