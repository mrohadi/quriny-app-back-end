import {
  LOADING_DATA,
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let indexLike = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[indexLike] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_SCREAM:
      return {
        ...state,
        screams: state.screams.filter(
          (scream) => scream.screamId !== action.payload
        ),
      };
    // case DELETE_SCREAM:
    //   index = state.screams.findIndex(
    //     (scream) => scream.screamId === action.payload
    //   );
    //   state.screams.splice(index, 1);
    //   return {
    //     ...state,
    //   };
    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams],
      };
    case SUBMIT_COMMENT:
      let indexComment = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      ); // Looks for the scream, just like in "like" and "unlike" reducers
      let updatedScreams = JSON.parse(JSON.stringify(state.screams)); // Deep copy of the array - simply spreading is won't work
      updatedScreams[indexComment].commentCount += 1;
      return {
        ...state,
        screams: updatedScreams,
        scream: {
          ...state.scream,
          comments: [action.payload.comment, ...state.scream.comments],
          commentCount: state.scream.commentCount + 1,
        },
      };
    default:
      return state;
  }
}
// case SUBMIT_COMMENT:
//       index = state.screams.findIndex(
//         scream => scream.screamId === action.payload.screamId
//       );
//     /////// Looks for the scream, just like in "like" and "unlike" reducers
//       let updatedScreams = JSON.parse(JSON.stringify(state.screams));
//  ///// deep copy of the array - simply spreading it won't work
//       updatedScreams[index].commentCount += 1;
//       return {
//         ...state,
//         screams: updatedScreams,
//         scream: {
//           ...state.scream,
//           comments: [action.payload.comment, ...state.scream.comments],
//           commentCount: state.scream.commentCount + 1
//         }
//       };
