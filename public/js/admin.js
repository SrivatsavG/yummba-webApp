const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article'); // finding the parent element

    //WE USE FETCH TO SEND REQUEST TO router.delete('/product/:productId', isAuth,adminController.deleteProduct);
   //FROM THE CLIENT SIDE

    fetch('/admin/product/' + prodId, {
        method:'DELETE',
        headers: {
            'csrf-token':csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data=> {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err=>console.log(err));
};

const deleteBlog = (btn) => {

    const blogId = btn.parentNode.querySelector('[name=blogId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const blogDeleteDiv = btn.closest('div'); // finding the parent element
    const blog = blogDeleteDiv.parentNode.parentNode.parentNode;

    //WE USE FETCH TO SEND REQUEST TO router.delete('/product/:productId', isAuth,adminController.deleteProduct);
   //FROM THE CLIENT SIDE

    fetch('/admin/blogs/' + blogId, {
        method:'DELETE',
        headers: {
            'csrf-token':csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data=> {
        console.log(data);
        blog.parentNode.removeChild(blog);
    })
    .catch(err=>console.log(err));
};