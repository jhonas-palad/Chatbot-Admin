import uid from 'react-uuid';

export const makeUID = (container, destructure = false) => {
    if(!container){
        return [];
    }

    return container.map( value => {
        if(destructure){
            return {
                id: uid(value),
                ...value
            }
        }
        else {
            return {
                id: uid(value),
                value
            }
        }
    });
}

export const compareContainer = (container1, container2) => {
    const len1 = container1.length;
    const len2 = container2.length;
    return len1 === len2 && container1.every(({value}, index) => {
        return value === container2[index].value; 
    });
}

export const isEmptyContainer = (container) => {
    return container.length === 0;
}

export const extractValues = (container) => {
    if(isEmptyContainer(container)){
        return false;
    }
    const containerValues = container.map(({value}) => value );
    return containerValues;
}