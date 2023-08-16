const welcomeTemplate = (user, setPassUrl, staticUrl) =>
  `<!doctypehtml>
    <html lang=en xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Oswald" rel=stylesheet>
    <link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel=stylesheet>
    <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel=stylesheet>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel=stylesheet>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel=stylesheet>

    <style>
        * {
            box-sizing: border-box
        }

        .vp-sidedock {
            display: none;
        }

        body {
            margin: 0;
            padding: 0
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none
        }

        p {
            line-height: inherit
        }

        @media (max-width:865px) {

            .fullMobileWidth,
            .row-content {
                width: 100% !important
            }

            .image_block img.big {
                width: auto !important
            }

            .column .border {
                display: none
            }

            table {
                table-layout: fixed !important
            }

            .stack .column {
                width: 100%;
                display: block
            }

            .reverse {
                display: table;
                width: 100%
            }

            .reverse .column.first {
                display: table-footer-group !important
            }

            .reverse .column.last {
                display: table-header-group !important
            }

            .row-2 td.column.first>table,
            .row-2 td.column.last>table {
                padding-left: 0;
                padding-right: 0
            }
        }
    </style>

    <body style=background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none>
        <table border=0 cellpadding=0 cellspacing=0 role=presentation
            style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100% class=nl-container>
            <tr>
                <td>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style="mso-table-lspace:0;mso-table-rspace:0;background-color:#0b0b23;background-image:url(${staticUrl}/4.jpg);background-position:top center;background-repeat:repeat;background-size:auto"
                        width=100% class="row row-1" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;background-color:#0f0f2d;background-size:auto;color:#000;width:845px
                                    width=845 class="row-content stack" align=center>
                                    <tr>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:10px;padding-bottom:0;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1" width=100%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=image_block>
                                                <tr>
                                                    <td style=width:100%;padding-right:0;padding-left:0>
                                                        <div style=line-height:10px align=center><a
                                                                href=https://oneplace.valuebound.net style=outline:0
                                                                tabindex=-1><img
                                                                    alt="Valuebound Consulting Services LLP"
                                                                    src=${staticUrl}/2609c443-67f8-4d7c-a7a6-03194ea45dae.png
                                                                    style=display:block;height:auto;border:0;width:169px;max-width:100%
                                                                    title="Valuebound Consulting Services LLP"
                                                                    width=169></a></div>
                                            </table>
                                            <table border=0 cellpadding=10 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=divider_block>
                                                <tr>
                                                    <td>
                                                        <div align=center>
                                                            <table border=0 cellpadding=0 cellspacing=0
                                                                role=presentation
                                                                style=mso-table-lspace:0;mso-table-rspace:0 width=10%>
                                                                <tr>
                                                                    <td style="font-size:1px;line-height:1px;border-top:2px solid #4b10f2"
                                                                        class=divider_inner><span> </span>
                                                            </table>
                                                        </div>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td
                                                        style=padding-left:20px;padding-right:20px;padding-top:25px;text-align:center;width:100%>
                                                        <h1
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Droid Serif',Georgia,Times,'Times New Roman',serif;font-size:53px;font-weight:400;letter-spacing:-1px;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">
                                                            <strong>Hi, <span
                                                                    style="text-transform:capitalize">${user}</span>
                                                                Your Account for Oneplace has been created!</strong><br>
                                                        </h1>
                                            </table>
                                            <table border=0 cellpadding=10 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word
                                                width=100% class=text_block>
                                                <tr>
                                                    <td>
                                                        <div style=font-family:sans-serif>
                                                            <div style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"
                                                                class=txtTinyMce-wrapper>
                                                                <p
                                                                    style=margin:0;font-size:14px;text-align:center;letter-spacing:3px>
                                                                    Join the fun now
                                                                <p
                                                                    style=margin:0;font-size:14px;text-align:center;letter-spacing:3px;mso-line-height-alt:14.399999999999999px>
                                                                     
                                                                <p
                                                                    style=margin:0;font-size:14px;text-align:center;letter-spacing:3px>
                                                                    Click the below link to set your password
                                                            </div>
                                                        </div>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=button_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;text-align:center>
                                                        <div align=center><a href=${setPassUrl}
                                                                style="text-decoration:none;display:inline-block;color:#fff;background-color:#4b10f2;border-radius:30px;width:auto;border-top:0 solid #8a3b8f;font-weight:400;border-right:0 solid #8a3b8f;border-bottom:0 solid #8a3b8f;border-left:0 solid #8a3b8f;padding-top:10px;padding-bottom:10px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all"><span
                                                                    style=padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal><span
                                                                        style=font-size:16px;line-height:2;word-break:break-word;mso-line-height-alt:32px>Set
                                                                        Your Password</span></span></a></div>

                                                        
                                                         <div align=center><a href="https://drive.google.com/file/d/1fkCcd0lXVoa63ePbjw2b-CH1CPZW4Izf/view?usp=sharing"
                                                                style="text-decoration:none;display:inline-block;color:#fff;background-color:#4b10f2;border-radius:30px;width:auto;border-top:0 solid #8a3b8f;font-weight:400;border-right:0 solid #8a3b8f;border-bottom:0 solid #8a3b8f;border-left:0 solid #8a3b8f;padding-top:10px;padding-bottom:10px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all; margin:15px"><span
                                                                    style=padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal><span
                                                                        style=font-size:16px;line-height:2;word-break:break-word;mso-line-height-alt:32px>Watch Demo Video</span></span></a></div>
                                            </table>
                                </table>
                    </table>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style=mso-table-lspace:0;mso-table-rspace:0;background-color:#0b0b23 width=100%
                        class="row row-2" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;background-color:#111129;color:#000;width:845px
                                    width=845 class="row-content stack" align=center>
                                    <tr class=reverse>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1 first" width=50%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td
                                                        style=padding-left:30px;padding-right:30px;padding-top:15px;text-align:center;width:100%>
                                                        <h2
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Droid Serif',Georgia,Times,'Times New Roman',serif;font-size:32px;font-weight:400;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0">
                                                            <span class=tinyMce-placeholder>Find you team!</span>
                                                        </h2>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word
                                                width=100% class=text_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:20px;padding-left:30px;padding-right:35px;padding-top:10px>
                                                        <div style=font-family:sans-serif>
                                                            <div style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.399999999999999px;color:#4b10f2;line-height:1.2"
                                                                class=txtTinyMce-wrapper>
                                                                <p
                                                                    style=margin:0;font-size:14px;text-align:left;letter-spacing:7px>
                                                                    Internal network
                                                            </div>
                                                        </div>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:5px;text-align:center;width:100%>
                                                        <h1
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;letter-spacing:normal;line-height:150%;text-align:left;margin-top:0;margin-bottom:0">
                                                            <span class=tinyMce-placeholder>Now you can find your
                                                                colleagues on the go! Use the network module to find out
                                                                about their personal and professional info and many
                                                                more!!!</span>
                                                        </h1>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=button_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:15px;padding-left:20px;padding-right:10px;padding-top:20px;text-align:left>
                                                        <a href=https://oneplace.valuebound.net
                                                            style="text-decoration:none;display:inline-block;color:#fff;background-color:#4b10f2;border-radius:30px;width:auto;border-top:0 solid #8a3b8f;font-weight:400;border-right:0 solid #8a3b8f;border-bottom:0 solid #8a3b8f;border-left:0 solid #8a3b8f;padding-top:10px;padding-bottom:10px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all"><span
                                                                style=padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal><span
                                                                    style=font-size:16px;line-height:2;word-break:break-word;mso-line-height-alt:32px>Contact
                                                                    now</span></span></a>
                                            </table>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-2 last" width=50%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=image_block>
                                                <tr>
                                                    <td
                                                        style=width:100%;padding-right:0;padding-left:0;padding-top:5px;padding-bottom:5px>
                                                        <div style=line-height:10px align=center><img
                                                                alt="Woman Contact"
                                                                src=${staticUrl}/1074007c-1fa4-4fdc-8356-4faa6278ae09.jpg
                                                                style=display:block;height:auto;border:0;width:423px;max-width:100%
                                                                title="Woman Contact" width=423></div>
                                            </table>
                                </table>
                    </table>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style=mso-table-lspace:0;mso-table-rspace:0;background-color:#0b0b23 width=100%
                        class="row row-4" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;background-color:#06071c;color:#000;width:845px
                                    width=845 class="row-content stack" align=center>
                                    <tr>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:0;padding-bottom:0;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1" width=100%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td style=text-align:center;width:100%>
                                                        <h2
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Droid Serif',Georgia,Times,'Times New Roman',serif;font-size:32px;font-weight:400;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">
                                                            We can't wait to see what you can do.</h2>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=image_block>
                                                <tr>
                                                    <td style=width:100%;padding-right:0;padding-left:0>
                                                        <div style=line-height:10px align=center>
                                                            <div style=outline:0 tabindex=-1><img
                                                                    alt="Play Video Woman Equality Day"
                                                                    src=${staticUrl}/5.jpg
                                                                    style=display:block;height:auto;border:0;width:507px;max-width:100%
                                                                    title="Play Video Woman Equality Day" width=507
                                                                    class="big fullMobileWidth"></div>
                                                        </div>
                                            </table>
                                            <table border=0 cellpadding=10 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word
                                                width=100% class=text_block>
                                                <tr>
                                                    <td>
                                                        <div style=font-family:Arial,sans-serif>
                                                            <div style="font-size:12px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"
                                                                class=txtTinyMce-wrapper></div>
                                                        </div>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td style=text-align:center;width:100%>
                                                        <h2
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Droid Serif',Georgia,Times,'Times New Roman',serif;font-size:16px;font-weight:400;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">
                                                            <span class=tinyMce-placeholder></span>
                                                        </h2>
                                            </table>
                                </table>
                    </table>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style=mso-table-lspace:0;mso-table-rspace:0;background-color:#0b0b23 width=100%
                        class="row row-5" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;background-color:#4b10f2;color:#000;width:845px
                                    width=845 class="row-content stack" align=center>
                                    <tr>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:5px;padding-bottom:5px;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1" width=100%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=image_block>
                                                <tr>
                                                    <td style=width:100%;padding-right:0;padding-left:0>
                                                        <div style=line-height:10px align=center><a
                                                                href=http://oneplace.valuebound.net style=outline:0
                                                                tabindex=-1><img
                                                                    alt="Valuebound Consulting Services LLP"
                                                                    src=${staticUrl}/452cf141-1754-4f2d-a051-59dac2497f86.png
                                                                    style=display:block;height:auto;border:0;width:169px;max-width:100%
                                                                    title="Valuebound Consulting Services LLP"
                                                                    width=169></a></div>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=social_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:10px;text-align:center;padding-right:0;padding-left:0>
                                                        <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                            style=mso-table-lspace:0;mso-table-rspace:0 width=144px
                                                            class=social-table align=center>
                                                            <tr>
                                                                <td style="padding:0 2px 0 2px"><a
                                                                        href=https://www.facebook.com/valuebound /><img
                                                                        alt=Facebook src=${staticUrl}/facebook2x.png
                                                                        style=display:block;height:auto;border:0
                                                                        title=Facebook width=32 height=32></a>
                                                                <td style="padding:0 2px 0 2px"><a
                                                                        href=https://twitter.com/valuebound><img
                                                                            alt=Twitter src=${staticUrl}/twitter2x.png
                                                                            style=display:block;height:auto;border:0
                                                                            title=Twitter width=32 height=32></a>
                                                                <td style="padding:0 2px 0 2px"><a
                                                                        href=https://www.instagram.com/valuebound /><img
                                                                        alt=Instagram src=${staticUrl}/instagram2x.png
                                                                        style=display:block;height:auto;border:0
                                                                        title=Instagram width=32 height=32></a>
                                                                <td style="padding:0 2px 0 2px"><a
                                                                        href=https://www.linkedin.com/company/valuebound><img
                                                                            alt=LinkedIn src=${staticUrl}/linkedin2x.png
                                                                            style=display:block;height:auto;border:0
                                                                            title=LinkedIn width=32 height=32></a>
                                                        </table>
                                            </table>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=heading_block>
                                                <tr>
                                                    <td
                                                        style=padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:5px;text-align:center;width:100%>
                                                        <h1
                                                            style="margin:0;color:#fff;direction:ltr;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;letter-spacing:normal;line-height:150%;text-align:center;margin-top:0;margin-bottom:0">
                                                            <span class=tinyMce-placeholder>If you have questions
                                                                regarding your data, please visit our <u><span
                                                                        style=color:#fff><a
                                                                            href=https://www.valuebound.com/privacy
                                                                            style=text-decoration:none;color:#fff
                                                                            rel=noopener>Privacy
                                                                            Policy</a></span></u><br>© 2022 Valuebound.
                                                                All Rights Reserved.</span>
                                                        </h1>
                                            </table>
                                </table>
                    </table>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style=mso-table-lspace:0;mso-table-rspace:0;background-color:#0b0b23 width=100%
                        class="row row-6" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;color:#000;width:845px width=845
                                    class="row-content stack" align=center>
                                    <tr>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:5px;padding-bottom:5px;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1" width=100%>
                                            <table border=0 cellpadding=15 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=divider_block>
                                                <tr>
                                                    <td>
                                                        <div align=center>
                                                            <table border=0 cellpadding=0 cellspacing=0
                                                                role=presentation
                                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%>
                                                                <tr>
                                                                    <td style="font-size:1px;line-height:1px;border-top:0 solid #bbb"
                                                                        class=divider_inner><span> </span>
                                                            </table>
                                                        </div>
                                            </table>
                                </table>
                    </table>
                    <table border=0 cellpadding=0 cellspacing=0 role=presentation
                        style=mso-table-lspace:0;mso-table-rspace:0 width=100% class="row row-7" align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                    style=mso-table-lspace:0;mso-table-rspace:0;color:#000;width:845px width=845
                                    class="row-content stack" align=center>
                                    <tr>
                                        <td style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:5px;padding-bottom:5px;border-top:0;border-right:0;border-bottom:0;border-left:0
                                            class="column column-1" width=100%>
                                            <table border=0 cellpadding=0 cellspacing=0 role=presentation
                                                style=mso-table-lspace:0;mso-table-rspace:0 width=100%
                                                class=empty_block>
                                                <tr>
                                                    <td>
                                                        <div></div>
                                            </table>
                                </table>
                    </table>
        </table>
    </body>`;

module.exports = { welcomeTemplate };
