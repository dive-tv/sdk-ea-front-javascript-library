import * as React from 'react';

export class Loading extends React.PureComponent<{}, {}> {
    public render() {
        return (
            <div className="fillParent" style={{ position: "relative" }}>
                <div className="spinner"></div>
            </div>
        );
    }
};
