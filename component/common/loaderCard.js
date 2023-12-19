import React from 'react'
import styles from '../../styles/Common.module.scss';

export default function LoaderCard() {
    const numberOfLoaders = 5;
    const loaderArray = Array.from({ length: numberOfLoaders }, (_, index) => index);
    return (
        <>
            <div className={styles["loader"]}>
                {loaderArray.map((index) => (
                    <>
                        <div key={index} className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}
