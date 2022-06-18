import './App.css';
import Navigator from './Navigator';
import { AppBuilder } from '../../Core/ApplicationBuilder';
import { CacheMiddleware, ModulesMiddleware, ReadyMiddleware, UserMiddleware, WalletMiddleware, Web3Middleware } from '../../Core/Middleware';
import { render } from 'solid-js/web';

AppBuilder.Add(new CacheMiddleware());
AppBuilder.Add(new UserMiddleware());
AppBuilder.Add(new Web3Middleware());
AppBuilder.Add(new WalletMiddleware());
AppBuilder.Add(new ModulesMiddleware());
AppBuilder.Add(new ReadyMiddleware());

AppBuilder.Run().then(() => render(() => <Navigator />, document.getElementById('root') as HTMLElement));
