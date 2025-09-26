/************************************************************************************
  Use this hook to authenticate users with AWS Cognito with a custom login page.
*************************************************************************************/

/**
 * Note curently  used.  This version uses Amplify v5 (or known as Generation 1).  The latest
 * version of Amplify is v6 (or what they refer to as Generation 2).
 *
 * Refer to https://docs.amplify.aws/javascript/start/ for info and migration guide
 */

// Uses version 5 which is deprecated
// import { Auth } from "aws-amplify";

// export const useAuth = () => {
//   const signIn = async (email: string) => {
//     try {
//       const cognitoUser = email && (await Auth.signIn(email));
//       return { status: 200, cognitoUser };
//     } catch (error) {
//       return { status: 500, error };
//     }
//   };

//   async function login(email: string) {
//     const res = await signIn(email);
//     if (res.status === 200) {
//       const cognitoUser = res.cognitoUser;
//       const userInfo = answerCustomChallengeTest(cognitoUser, email);
//       return userInfo;
//     } else {
//       alert(res.error);
//     }
//   }

//   async function answerCustomChallengeTest(cognitoUser: any, email: string) {
//     const res = await answerCustomChallenge(cognitoUser, email);
//     if (res.status === 200) {
//       var userInfo = {
//         userId:
//           cognitoUser.signInUserSession.idToken.payload["cognito:username"],
//         accessToken: cognitoUser.signInUserSession.idToken.jwtToken,
//         email: cognitoUser.signInUserSession.idToken.payload.email,
//         groups: cognitoUser.signInUserSession.idToken.payload["cognito:groups"],
//       };
//       return userInfo;
//     } else {
//       alert(res.error);
//     }
//   }

//   const answerCustomChallenge = async (cognitoUser: any, email: string) => {
//     try {
//       await Auth.sendCustomChallengeAnswer(cognitoUser, email);
//       return { status: 200 };
//     } catch (error) {
//       return { status: 500, error };
//     }
//   };

//   return { signIn, login, answerCustomChallenge };
// };
