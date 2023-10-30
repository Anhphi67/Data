import toast from 'react-hot-toast';
export const ADD_TO_COMPARE = "ADD_TO_COMPARE";
export const DELETE_FROM_COMPARE = "DELETE_FROM_COMPARE";

// add to compare
export const addToCompare = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      toast.success('Added To Compare', {});
    }
    dispatch({ type: ADD_TO_COMPARE, payload: item });
  };
};

// delete from compare
export const deleteFromCompare = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      // toast('Removed From Compare!',
      //   {
      //     icon: '⚠️',
      //     style: {
      //       background: '#ffc107',
      //       color: '#fff',
      //     },
      //   }
      // );
      toast.success('Removed From Compare', {
        style: {
          background: '#ffc107',
          color: '#fff',
        },
      });
    }
    dispatch({ type: DELETE_FROM_COMPARE, payload: item });
  };
};
