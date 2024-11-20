import { message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "antd/lib/modal/Modal";
import { Tree, TreeNode } from 'react-organizational-chart';


export const MoveSubjects = (props) => {
    const subjectId = props.subjectId;
    const subjects = props.subjects;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [parentId, setParentId] = useState('');

    /*********************************************** onChange *******************************************/

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getEditCatHandler = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/subject/get/edit/${subjectId}`).then(res => {
            if(res.status === 200) {
                  res.data.parentId && setParentId(res.data.parentId._id);
            } else {
              console.log('error')
            }
        });
         
    
      }
    /************************************************ Submit **********************************************/
    const editHandler = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('parentId', parentId);
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/subject/move/${subjectId}`, data, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                message.success({
                    content: res.data.successMessage,
                    duration: 1,
                    style: {
                        marginTop: '20vh',
                    },
                });
                props.refreshFunction(true);
                setIsModalVisible(false);
            }
            else {
                message.error({
                    content: res.data.errorMessage,
                    duration: 1,
                    style: {
                        marginTop: '20vh',
                    },
                });
            }
        })
    }

    useEffect(() => {
        getEditCatHandler();
        return () => {
            
        }
    }, []);

    const Children = props => (
        <>
            <TreeNode className = 'px-4' label={
                    props.children._id === parentId ?
                <button className = 'btn btn-success btn-sm'>{props.children.name}  </button>
                :
                <button className = 'btn btn-secondary btn-sm' onClick = {() => setParentId(props.children._id)}>{props.children.name}  </button>
            }>
                {props.children.children && (
                    <Tree
                        lineBorderRadius="15px"
                        lineColor="green"
                        lineWidth = '3px'
                    >{renderChild(props.children.children)}</Tree>
                )}
            </TreeNode>
        </>
    );

    const renderChild = item => item.map(it => <Children children={it} />);

    return (
        <>
            <a onClick={showModal}>Move</a>
            <Modal width = {800} footer={false} title="Edit Subjects" visible={isModalVisible} onCancel={handleCancel}>
                <form style={{ display: 'grid', placeItems: 'center', overflow: 'auto', paddingBottom: '32px' }} onSubmit={editHandler}>
                    <h4 className='mb-5'>Edit Your Subjects</h4>
                        <div className="Tree">
                        <Tree
                        lineBorderRadius="10px"
                        lineColor="green"
                        lineHeight="10px"
                        lineWidth="3px"
                        
                        label={
                                <a role = 'button' type = 'button' className = 'btn btn-success ant-dropdown-link btn-sm px-1'>
                                    Everything
                                </a>
                        }>
                            {renderChild(subjects)}
                        </Tree>
                        </div>
                    <button type="submit" className="btn btn-dark mt-4" style = {{width: '200px'}}>Submit</button>
                </form>
            </Modal>
        </>
    );
}