import { Header } from "./components/Header/Header";
import { Input } from "./components/Input/Input";
import styles from "./CSS/StylesApp.module.scss";

function App() {
    return (
    <div className={styles.appWrapper}>
        <section className={styles.sectionContainer}>
            <Header title={"todos"}/>
            <Input />
        </section>
        <div className={styles.authorsSection}>
            <p>Double-click to edit a todo</p>
            <p>Created by Oscar Godson</p>
            <p>Refactored by Christoph Burgmer</p>
            <p>Recreated by Radosław Czerniawski</p>
        </div>
    </div>
    );

}

export default App;
