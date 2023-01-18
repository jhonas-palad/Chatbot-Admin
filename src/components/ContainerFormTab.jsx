import ContainerFormGroup from './ContainerFormGroup';
import ContainerPagination from './ContainerPagination';
import EditableText from './EditableText';
import Accordion from 'react-bootstrap/Accordion';
import React from 'react'

export const ContainerFormTab = (
    {
      alphaNumeric,
      useFormGroupProps,
      useContainerState,
      itemsPerPage,
      useCurrentPageState,
      useEditTextCallback
    }
) => {
    const {label, inputState, onChange, buttonClick, errMsg} = useFormGroupProps();

    const { container, setContainer, origContainer } = useContainerState();

    const { currentElements } = useCurrentPageState();

    const { handleEditText, handleRemoveText} = useEditTextCallback();

    return (
      <div>
        <ContainerFormGroup
          label={label}
          inputState={inputState}
          onChange={onChange}
          setContainer={setContainer}
          buttonClick={buttonClick}
          errMsg={errMsg}
        />
        <ContainerPagination
          container={container}
          itemsPerPage={itemsPerPage}
          useCurrentPageState={useCurrentPageState}
        >
          {
              currentElements.length <= 0 ? (
                <p>Add {label}</p> 
              ) : (
                  currentElements.map((text, index) =>
                  <Accordion.Item eventKey={index.toString()} key={text.id} >
                    <Accordion.Header
                        className='w-100'>
                            <span style={{maxWidth:'450px', fontWeight:'300'}} className="d-inline-block text-truncate">
                                # {text.value}
                            </span>
                    </Accordion.Header>
                    <EditableText
                        alphaNumeric={alphaNumeric}
                        text={text}
                        useEditText={() => handleEditText(container, setContainer, origContainer)}
                        useRemoveText={() => handleRemoveText(container, setContainer, origContainer)}
                    />
                  </Accordion.Item>
                  )
              )
          }
        </ContainerPagination>
        
      </div>
    )
}

export default ContainerFormTab;