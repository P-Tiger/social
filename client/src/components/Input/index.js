import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { after } from '../../store/features/news';
import {
    requestPost as postComment
} from '../../store/features/interaction'
export default function InputComponent({ list_post, id, user }) {
    const [comment, setComment] = useState('');
    const dispatch = useDispatch()

    const handleSubmitComment = (e, post_ids, post_id) => {
        e.preventDefault();
        if (comment) {
            dispatch(postComment({ comment: comment, post_ids: post_ids, perPage: 5, post_id: post_id }))
            setComment('')
        }
    }

    return (
        <React.Fragment>
            <Image src={user?.image || "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
            <Form className='form-comment' onSubmit={e => handleSubmitComment(e, list_post, id)}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Nhập bình luận" className='border form-input-comment' value={comment} onChange={e => setComment(e.target.value)} />
                </Form.Group>
            </Form>
        </React.Fragment>
    )
}