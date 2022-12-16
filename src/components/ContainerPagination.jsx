import { useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import Pagination from 'react-bootstrap/Pagination';

const ContainerPagination = ({
    container,
    itemsPerPage,
    useCurrentPageState,
    children
}) => {
    const {
        currentPage, 
        setCurrentPage,  
        setCurrentElements
        } = useCurrentPageState();
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(container.length / itemsPerPage);
  
    useEffect(()=>{
        setCurrentElements(container.slice(indexOfFirstItem, indexOfLastItem));
    }, [container, currentPage]); //eslint-disable-line

    const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return (
        <div className="d-flex flex-column border-top">
            <Pagination className="align-self-end " style={{paddingTop: "1rem"}}>
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
            <Accordion className="border-bottom" style={{paddingBottom: "1rem"}}>
                {
                    children
                }
            </Accordion>
            
        </div>
    )
}

export default ContainerPagination;