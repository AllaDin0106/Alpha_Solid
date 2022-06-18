import './Create.css';
import { Component, createSignal, onMount } from "solid-js";
import { Container, LoginMode, LoginMutable, LoginScreen } from "../Controller";
import { Cache } from '../../../Core/Cache';
import { User } from '../../../Core/User';
import { Icon, Input, Modal } from '../../../Components/Components';
import { Jiggle } from '../../../Components/Logo/Logo';
import { createMutable } from 'solid-js/store';
import { ShuffleArray } from '../../../Definitions/Methods';

const Step1: Component = () => {

    Cache.Clear.Temp();

    LoginMutable.Next.Active = false;
    LoginMutable.Next.Action = () => { LoginMutable.Create = 2; Jiggle(); }
    LoginMutable.Prev.Action = () => LoginMutable.Screen = LoginScreen.Splash;

    return <div data-create-stage="1">
        <Input type='password' header='Enter password' required onInput={e => {
            Cache.User.Temp.Password1 = e.currentTarget.value;
            User.ValidatePassword();
        }} icon={{ name: 'key', side: 'right' }} />
        <br />
        <Input type='password' header='Verify password' required onInput={e => {
            Cache.User.Temp.Password2 = e.currentTarget.value;
            User.ValidatePassword();
        }} />
        <br />
        <br />
        <Modal value='Is this secure?'>
            <h2>Is this secure?</h2>
            <br />
            <p>You're in good hands.<br />Your credentials are both encrypted and hashed using AES and SHA256 algorithms.</p>
        </Modal>
    </div>
}

const Step2: Component = () => {
    LoginMutable.Next.Active = false;
    LoginMutable.Next.Action = () => { LoginMutable.Create = 3; Jiggle(); }
    LoginMutable.Prev.Action = () => LoginMutable.Create = 1;

    User.Create.Generate();

    const [revealed, setRevealed] = createSignal(false);

    const Reveal = () => { setRevealed(true); LoginMutable.Next.Active = true; }

    return <div data-create-stage="2" classList={{ revealed: revealed() }}>
        <div class='new-mnemonic'>
            <p>{Cache.User.Temp.Seedphrase.split(' ').map(w => <span>{w}</span>)}</p>
            <div onClick={() => Reveal()}>Click here to reveal your seed phrase.</div>
        </div>
        <br />
        <br />
        <div class='attention'>
            <h3>This is your seed phrase.</h3>
            <br />
            Write it down and save it, you'll confirm this sequence on the next screen.
            <br />
            <br />
            <br />
            <Modal value='Tell me more'>
                <h2>What is a seed phrase?</h2>
                <br />
                <p>A Secret Recovery Phrase, mnemonic phrase, or Seed Phrase is a set of typically either 12 or 24 words, which can be used to derive an infinite number of accounts.
                    <br /><br />
                    Often times these phrases are used by cryptocurrency hardware wallets, to be written down on a piece of paper by the user to safely back up the users' funds.
                </p>
            </Modal>
        </div>
    </div>
}

const Step3: Component = () => {
    LoginMutable.Next.Active = false;
    LoginMutable.Next.Action = () => { LoginMutable.Mode = LoginMode.Post; User.LogIn(); }
    LoginMutable.Prev.Action = () => LoginMutable.Create = 2;

    const SeedphraseArray = Cache.User.Temp.Seedphrase.split(' ');

    const Words = createMutable({
        Shuffled: ShuffleArray(SeedphraseArray),
        Sorted: []
    });

    const MoveWord = (index, from, to) => {
        to.push(from[index]);
        from = from.splice(index, 1);
        CheckEquality();
    }

    const CheckEquality = () => {

        let equal = true;
        if (Words.Sorted.length < 12)
            equal = false;
        else
            for (let i = 0; i < 12; i++)
                if (Words.Sorted[i] !== SeedphraseArray[i])
                    equal = false;

        LoginMutable.Next.Active = equal;
    }

    return <div data-create-stage="3" classList={{ done: Words.Sorted.length === 12 }}>
        <div class='debug'>{Cache.User.Temp.Seedphrase}</div>
        <div class='attention'>
            <h3>Verify your seed phrase.</h3>
            <br />
            Choose each word in the correct order.
        </div>
        <br />
        <div class='match-test'>
            <div class='shuffled'>
                {Words.Shuffled.map((word, i) => <span onClick={() => {
                    MoveWord(i, Words.Shuffled, Words.Sorted);
                }}>{word}</span>)}
            </div>
            <Icon value='angles-down' />
            <div class='sorted'>
                {Words.Sorted.map((word, i) => <span onClick={() => {
                    MoveWord(i, Words.Sorted, Words.Shuffled);
                }}>{word}</span>)}
            </div>
        </div>

        {(Words.Sorted.length === 12 && LoginMutable.Next.Active) && <div class='feedback correct'>
            <b>Nice one!</b> You can now sign in to your brand new wallet.
        </div>}

        {(Words.Sorted.length === 12 && !LoginMutable.Next.Active) && <div class='feedback incorrect'>
            <b>Wrong order!</b> Try again or <span onClick={() => LoginMutable.Create = 2}>generate a new seed phrase</span>.
        </div>}

    </div>
}

const Create: Component = () => {

    return <Container index={LoginMutable.Create} data='create' breadcrumbs={['Password', 'Seed Phrase', 'Verify']} title='New Wallet'>
        {LoginMutable.Create === 1 && <Step1 />}
        {LoginMutable.Create === 2 && <Step2 />}
        {LoginMutable.Create === 3 && <Step3 />}
    </Container>;
}

export default Create;