import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import EditableText from './EditableText';
import Pagination from 'react-bootstrap/Pagination';

const ContainerTextPagination = ({
    useContainerState,
    origContainer,
    handleEditText,
    handleRemoveText,
    setShowSaveChanges,
    itemsPerPage,
    useCurrentPageState
}) => {
    const {container, setContainer} = useContainerState();
    const {currentPage, setCurrentPage} = useCurrentPageState();
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentElements = container.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(container.length / itemsPerPage);



    const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return (
        <div className="d-flex flex-column">
            <Pagination className="align-self-end">
                {
                    currentPage !== 1 && <Pagination.First onClick={()=>paginate(1)}/>
                }
                {
                    currentPage > 1 && <Pagination.Prev onClick={()=>paginate(currentPage - 1)}/>
                }
                {
                    currentPage < totalPages && <Pagination.Next onClick={()=>paginate(currentPage + 1)}/>
                }
                {
                    totalPages !== 0 && currentPage !== totalPages && <Pagination.Last onClick={()=>paginate(totalPages)}/>
                }
            </Pagination>
            <Accordion>
                {
                    currentElements.length <= 0 ? 
                    <p>Add a pattern</p>
                            : 
                    currentElements.map( (text, index) => 
                        <Accordion.Item eventKey={index.toString()} key={text.id} >
                            <Accordion.Header
                             className='w-100'>
                                <span style={{maxWidth:'450px', fontWeight:'300'}} className="d-inline-block text-truncate">
                                    # {text.value}
                                    </span>
                             </Accordion.Header>
                            <EditableText
                                text={text}
                                useSaveFlag={() => setShowSaveChanges}
                                container={container}
                                useEditText={() => handleEditText(container, setContainer, origContainer)}
                                useRemoveText={() => handleRemoveText(container, setContainer, origContainer)}
                            />
                        </Accordion.Item>
                    )
                }
            </Accordion>
            
        </div>
    )
}

export default ContainerTextPagination;