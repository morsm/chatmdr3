const isWindowOpener = (opener) =>
opener !== null && opener !== undefined;

const openerPostMessage = (opener, message) =>
opener.postMessage(message);

function closePopup(accessToken, idToken, state)
{
    const opener = window?.opener;

    if (isWindowOpener(opener)) {
        openerPostMessage(opener, {
            type: 'react-use-oauth2-response',
            state: state,
            payload: {
                data: { access_token: accessToken, id_token: idToken }
            },
        });
    }
}
