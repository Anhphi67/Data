import toast from 'react-hot-toast';

export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const DELETE_FROM_WISHLIST = "DELETE_FROM_WISHLIST";
export const DELETE_ALL_FROM_WISHLIST = "DELETE_ALL_FROM_WISHLIST";

// add to wishlist
export const addToWishlist = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      toast.success('Added To Wishlist', {});
    }
    dispatch({ type: ADD_TO_WISHLIST, payload: item });
  };
};

// delete from wishlist
export const deleteFromWishlist = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      // toast('Removed From Wishlist!',
      //   {
      //     icon: '⚠️',
      //     style: {
      //       background: '#ffc107',
      //       color: '#fff',
      //     },
      //   }
      // );

      toast.success('Removed From Wishlist', {
        style: {
          background: '#ffc107',
          color: '#fff',
        },
      });

    }
    dispatch({ type: DELETE_FROM_WISHLIST, payload: item });
  };
};

//delete all from wishlist
export const deleteAllFromWishlist = addToast => {
  return dispatch => {
    if (addToast) {
      toast.success('Removed All From Wishlist', {
        style: {
          background: '#ffc107',
          color: '#fff',
        },
      });
      // toast('Removed All From Wishlist!',
      //   {
      //     icon: '⚠️',
      //     style: {
      //       background: '#ffc107',
      //       color: '#fff',
      //     },
      //   }
      // );
    }
    dispatch({ type: DELETE_ALL_FROM_WISHLIST });
  };
};
