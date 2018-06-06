import title from '../components/title'

export default ({ }) => {
    return html`
        <c-title-if test="true" caption="'<xxx-if>'" />

        <img-if test="1" src="//myaccount.vandenbroeleconnect.be/Images/Reskin/e-id.png" alt="" style="opacity:.5;border:1px" />

        <br-if test="true" />

        <if test="3 > 2">
            lol
        </if>

        <span-if test="true">wut</span-if>

        <for each="x in 5">
            ${x}
        </for>`
}