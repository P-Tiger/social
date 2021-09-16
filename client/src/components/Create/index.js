import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { after } from '../../store/features/news';
export default function CreateComponent({ show, setShow, handleClose, department, user, socket }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selected, setSelected] = useState('');
    const dispatch = useDispatch()


    useEffect(() => {
        // socket.on("Output Create", data => {
        //     if (data.dataList) {
        //         dispatch(after(data.dataList))
        //     }
        // })
    }, [dispatch, socket])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selected === '') {
            Swal.fire("Thiếu trường phòng/khoa")
            return;
        }
        let checkData = _.includes(user.list_department, selected)
        if (!checkData && user.type === 2) {
            Swal.fire("Bạn không quản lý phòng ban này")
            return;
        }
        socket.emit('Create News', {
            title: title, content: content, department: selected, user: user
        })
        setTitle('')
        setContent('')
        setSelected('')
        setShow(false);
    }


    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            size="lg"
            keyboard={false}
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Form.Control type="text" placeholder="Nhập title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-3" type="text" placeholder="Nhập content" value={content} onChange={e => setContent(e.target.value)} required />
                    <Form.Control as="select" value={selected} onChange={(e) => setSelected(e.target.value)} required>
                        <option value={''} >Chọn Phòng/Khoa </option>
                        {_.map(department, (x) => {
                            return (
                                <option label={x.name} value={x._id} >{x.name}</option>
                            )
                        })}
                    </Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}