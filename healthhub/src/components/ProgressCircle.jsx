import { ColorRing, Triangle } from  'react-loader-spinner';

export function ProgressCircle() {
    return (
        <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
  );
}

export function ProgressTriangle() {
    return (
        <Triangle
            height="40"
            width="40"
            color="#4ade80"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
      />
    );
  }

