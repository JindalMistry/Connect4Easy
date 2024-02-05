import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EnterOtp from './Page/enter-otp';
import Home from './Page/Home';
import { Provider } from 'react-redux';
import store from './Store/store';
import Game from './Page/game';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/otp",
    element: <EnterOtp />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/game",
    element: <Game />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.Fragment>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        pauseOnHover={false}
        progressClassName="toastProgress"
        bodyClassName="toastBody"
      />
    </Provider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
