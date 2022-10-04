import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { firebaseTestConfig } from '../firebaseConf';
import { getDatabase, get, child, ref, set, push, onValue } from 'firebase/database';

const email = 'boury_a@etna-alternance.net';
const password = 'alphabetagamma';
const agendaName = 'nouvelAgenda'
let app;
let database;

beforeAll(() => {
    app = firebase.initializeApp(firebaseTestConfig, 'MYAGENDA');
    database = getDatabase(app);
});

it('correct db con', () => {
    expect.assertions(2);
    expect(app.name).toBe('MYAGENDA');
    expect(app.options.databaseURL).toBe(firebaseTestConfig.databaseURL);
});

it('user creation fails for db because email is on wrong format', async () => {
    const auth = getAuth(app);
    try {
        await createUserWithEmailAndPassword(auth, email.split('@')[0] + email.split('@')[1], password);
    } catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/invalid-email');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user creation fails for db because password is too short', async () => {
    const auth = getAuth(app);
    try {
        await createUserWithEmailAndPassword(auth, email, password.substring(0, 3));
    } catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/weak-password');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user creation succeeds for db', async () => {
    expect.assertions(1);
    const auth = getAuth(app);
    const dbUserCreation = await createUserWithEmailAndPassword(auth, email, password);
    expect(dbUserCreation.user.reloadUserInfo.email).toBe(email);
});

it('user creation fails for db because user already exists', async () => {
    const auth = getAuth(app);
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/email-already-in-use');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user sign in fails for db because user password is wrong', async () => {
    const auth = getAuth(app);
    try {
        await signInWithEmailAndPassword(auth, email, 'wrongPassword');
    }
    catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/wrong-password');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user sign in fails for db because user does not exist', async () => {
    const auth = getAuth(app);
    try {
        await signInWithEmailAndPassword(auth, email + 't', password);
    }
    catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/user-not-found');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user sign in fails for db because email is on wrong format ', async () => {
    const auth = getAuth(app);
    try {
        await signInWithEmailAndPassword(auth, email.split('@')[0] + email.split('@')[1], password)
    }
    catch (error) {
        expect.assertions(2);
        expect(error.code).toBe('auth/invalid-email');
        expect(error.name).toBe('FirebaseError');
    }
});

it('user sign in succeeds for db', async () => {
    expect.assertions(4);
    const auth = getAuth(app);
    const signIn = await signInWithEmailAndPassword(auth, email, password);
    expect(signIn.user.providerId).toBe('firebase')
    expect(signIn.user.reloadUserInfo.email).toBe(email)
    expect(signIn.user.auth.config.apiKey).toBe(firebaseTestConfig.apiKey)
    expect(signIn.user.auth.config.authDomain).toBe(firebaseTestConfig.authDomain)
});

it('user registered is followed by agendas and application user creation', async () => {
    expect.assertions(1);
    const objectList = [];
    let expected = ['Mon agenda familial', 'Mon agenda personnel'];
    let userRef = ref(database, 'Users');
    let newReference = push(userRef)
    await set(newReference, {
        email: email,
    });
    let agendaRef = ref(database, 'Agendas');
    newReference = push(agendaRef);
    await set(newReference, {
        name: "Mon agenda familial",
        owner: email,
        members: {},
        events: {},
    });
    newReference = push(agendaRef);
    await set(newReference, {
        name: "Mon agenda personnel",
        owner: email,
        members: {},
        events: {},
    });
    return new Promise((resolve) => {
        get(child(ref(database), 'Agendas')).then((snapshot) => {
            for (let agendaID in snapshot.val()) {
                objectList.push(snapshot.val()[agendaID].name);
            }
            resolve(objectList)
        })
    }).then((response) => {
        expect(response).toEqual(expect.arrayContaining(expected));
    });
});

it('current user create another agenda', async () => {
    expect.assertions(2);
    let agendaRef = ref(database, 'Agendas');
    const newRef = push(agendaRef)
    await set(newRef, {
        'name': agendaName,
        'owner': email
    });
    const newAgendaRef = `${newRef.toString().split("/")[3]}/${newRef.toString().split("/")[4]}`
    return new Promise((resolve) => {
        get(child(ref(database), newAgendaRef)).then((snapshot) => {
            resolve(snapshot.val())
        });
    }).then((response) => {
        expect(response.name).toEqual(agendaName);
        expect(response.owner).toEqual(email);
    });
});

it('current user create a public event in his personnal agenda', async () => {
    new Promise((resolve) => {
        get(child(ref(database), 'Agendas')).then((snapshot) => {
            for (let agendaID in snapshot.val()) {
                if (snapshot.val()[agendaID].owner === email && snapshot.val()[agendaID].name) {
                    resolve(ref(database, 'Agendas/' + agendaID + '/Events'))
                }
            }
        })
    }).then((response) => {
        console.log(response)
        let newRef = push(response)
        set(newRef, {
            'name': "eventName",
            'firstDate': "firstDate",
            'secondDate': "secondDate",
            'firstTime': "firstTime",
            'secondTime': "secondTime",
            'eventDescription': "eventDescription",
            'private': "_private",
            'owner': "owner"
        });
    })
});

// DB AUTHENTICATION USER IS DESTROYED
it('current user is destroyed', async () => {
    expect.assertions(2);
    const auth = getAuth(app);
    let user = auth.currentUser;
    expect(user.reloadUserInfo.email).toEqual(email);
    try {
        await deleteUser(user);
        user = auth.currentUser;
        expect(user).toBeNull();
    } catch (error) {
        console.log("ERROR", error)
    }
});

// ALL DB OBJECTS ARE DESTROYED
it('test database is cleaned', async () => {
    expect.assertions(1);
    await set(ref(database), {});
    return new Promise((resolve) => {
        get(child(ref(database), 'Agendas')).then((snapshot) => {
            let val = snapshot.val()
            resolve(val)
        });
    }).then((response) => {
        expect(response).toBeNull()
    })
});

