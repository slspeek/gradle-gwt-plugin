(function() {
    var B = "twttr_anywhere",R = "twttr_signed_out";
    var E,G = 0,A = 0,V = [];

    function M() {
        try {
            var h = document.getElementsByTagName("script")
        } catch(p) {
            var h = []
        }
        var r,f,g = {};
        for (var n = 0,o = h.length; n < o; n++) {
            r = h[n];
            if (r.src.indexOf("/anywhere.js?") > -1) {
                f = r
            }
        }
        if (f) {
            var q = f.src.split("?").pop();
            if (q.indexOf("=") > 0) {
                var d = q.split("&"),m;
                for (var l = 0; (m = d[l]); l++) {
                    var k = m.split("="),t = k[0],s = k[1];
                    if (t == "id") {
                        g.clientID = s
                    }
                    if (t == "v") {
                        g.version = s
                    }
                }
            } else {
                g.clientID = q
            }
        }
        return g
    }

    var W = (function() {
        var e,h,g;

        function f(k) {
            var o = g.childNodes,n,m = null;
            for (var l = 0,j = o.length; l < j; l++) {
                n = o.item(l);
                if (n.getAttribute("key") == k) {
                    m = n;
                    break
                }
            }
            return m
        }

        var d = {isExpired:function(i) {
            if (i.match(/_expiry$/)) {
                return false
            }
            var j = this.get(i + "_expiry");
            return(j && (new Date()).getTime() > j)
        },setExpiry:function(j, i) {
            this.set(j + "_expiry", (new Date()).getTime() + (1000 * 60 * 60 * i))
        },setWithExpiry:function(j, k, i) {
            this.setExpiry(j, i);
            this.set(j, k)
        },expire:function(i) {
            this.del(i);
            this.del(i + "_expiry")
        }};
        if ((e = window.localStorage)) {
            d.get = function(i) {
                if (this.isExpired(i)) {
                    this.expire(i);
                    return null
                } else {
                    return e[i]
                }
            };
            d.set = function(i, j) {
                return(e[i] = j)
            };
            d.del = function(i) {
                e.removeItem(i)
            };
            d.getAll = function(n) {
                var m = -1,l,j = localStorage.length,k = {};
                while (++m < j) {
                    l = localStorage.key(m);
                    if (typeof n == "undefined" || l.match(n)) {
                        k[l] = localStorage.getItem(l)
                    }
                }
                return k
            };
            return d
        } else {
            if (document.documentElement.addBehavior) {
                e = document.documentElement;
                e.addBehavior("#default#userData");
                e.load("twitter-anywhere");
                h = e.xmlDocument;
                g = h.documentElement;
                function f(k) {
                    var o = g.childNodes,n,m = null;
                    for (var l = 0,j = o.length; l < j; l++) {
                        n = o.item(l);
                        if (n.getAttribute("key") == k) {
                            m = n;
                            break
                        }
                    }
                    return m
                }

                d.get = function(i) {
                    var k,j = null;
                    if (this.isExpired(i)) {
                        this.expire(i)
                    } else {
                        k = f(i);
                        if (k) {
                            j = k.getAttribute("value")
                        }
                    }
                    return j
                };
                d.set = function(i, k) {
                    var j = f(i);
                    if (!j) {
                        j = h.createNode(1, "item", "");
                        j.setAttribute("key", i);
                        j.setAttribute("value", k);
                        g.appendChild(j)
                    } else {
                        j.setAttribute("value", k)
                    }
                    e.save("twitter-anywhere");
                    return k
                };
                d.del = function(i) {
                    var j = f(i);
                    if (j) {
                        g.removeChild(j)
                    }
                    e.save("twitter-anywhere")
                };
                d.clear = function() {
                    while (g.firstChild) {
                        g.removeChild(g.firstChild)
                    }
                    e.save("twitter-anywhere")
                };
                d.getAll = function(o) {
                    var n = g.childNodes,m = -1,j = n.length,l = {},p,k;
                    while (++m < j) {
                        p = n.item(m);
                        k = p.getAttribute("key");
                        if (typeof o == "undefined" || k.match(o)) {
                            l[k] = p.getAttribute("value")
                        }
                    }
                    return l
                };
                return d
            }
        }
    }());

    function Q(d) {
        var e = [twttr.anywhere._assetUrl()];
        if (d.indexOf("_dev") !== 0) {
            e = e.concat([d])
        }
        return e.concat("javascripts/client.js").join("/")
    }

    function O(e) {
        var g = location.href.split("#");
        var d = g.pop();
        var f = new RegExp(e + "=(.+?)(&|$)");
        if (d.indexOf(e) != -1) {
            return d.match(f)[1]
        }
    }

    function T() {
        var d;
        if (W && (d = W.get(B))) {
            return d
        }
    }

    function S(g) {
        var e = g._clients,h = O("bridge_code");
        for (var f = 0,d = e.length; f < d; f++) {
            e[f]._fireAuthComplete(h)
        }
    }

    function H(g) {
        var e = g._clients;
        for (var f = 0,d = e.length; f < d; f++) {
            e[f]._fireAuthFailed()
        }
    }

    function K(g) {
        var e = g._clients;
        for (var f = 0,d = e.length; f < d; f++) {
            e[f]._fireSignOut()
        }
    }

    function U() {
        var f = null;
        if ((f = O("oauth_access_token"))) {
            var d = window.opener || window.parent;
            if (d && d.parent.twttr) {
                d.parent.twttr.anywhere._setToken(f);
                S(d.parent.twttr.anywhere);
                if (window.opener) {
                    window.close();
                    if (window.self) {
                        window.self.close()
                    }
                }
                return"callback_new_window"
            } else {
                if (window.parent != window && window.parent && window.parent.twttr) {
                    window.parent.parent.twttr.anywhere._setToken(f);
                    S(window.parent.parent.twttr.anywhere);
                    window.parent.parent.twttr.anywhere._removeHeadlessAuth();
                    return"headless"
                } else {
                    twttr.anywhere._setToken(f);
                    S(window.parent.parent.twttr.anywhere);
                    setTimeout(function() {
                        window.location.hash = ""
                    }, 100);
                    return"callback_same_window"
                }
            }
        }
        if (O("oauth_error_reason")) {
            H(window.parent.parent.twttr.anywhere);
            window.parent.parent.twttr.anywhere._removeHeadlessAuth();
            return"headless"
        }
        try {
            window.parent.parent.twttr.anywhere._removeHeadlessAuth()
        } catch(g) {
        }
        if ((f = T())) {
            twttr.anywhere._setToken(f);
            return"cookie"
        }
    }

    function F(e, f) {
        for (var d in f) {
            e[d] = f[d]
        }
        return e
    }

    function c(e, d) {
        return function() {
            return d.apply(e, arguments)
        }
    }

    var b = navigator.userAgent.toLowerCase();
    var P = (/msie/gi.test(b) && !/opera/gi.test(b));
    var J = '<iframe tabindex="-1" role="presentation" style="position:absolute;top:-9999px;"></iframe>';

    function I(d) {
        var h = document.createElement("div");
        h.innerHTML = J;
        var f = h.firstChild,g = c(f, d);
        if (P) {
            if (twttr.anywhere._config.domain) {
                f.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"" + twttr.anywhere._config.domain + "\\\";<\\\\/script>\\');document.close();};<\/script>'"
            }
            var e = false;
            f.attachEvent("onload", function() {
                if (e) {
                    return
                }
                e = true;
                g()
            })
        } else {
            f.addEventListener("load", g, false)
        }
        document.body.insertBefore(f, document.body.firstChild);
        return f
    }

    function Z(d) {
        throw (d)
    }

    function a(d, f, e) {
        if (!d._initCallbacks) {
            d._initCallbacks = []
        }
        d._initCallbacks.push([f,e])
    }

    function D(f, k, l) {
        var h = l.version,i;
        var e = f.contentWindow,g = l.window;
        var j = e.document.createElement("script");
        var d = Q(h);
        f.id = "_twttr_anywhere_client_" + h;
        a(e, k, l);
        e._VERSION = h;
        e._URL = d;
        j.type = "text/javascript";
        j.src = d;
        i = e.document.getElementsByTagName("head")[0];
        if (!i) {
            i = document.createElement("head");
            e.document.documentElement.appendChild(i)
        }
        i.appendChild(j);
        return j
    }

    function Y(d, f) {
        if (document.body) {
            var e = twttr.anywhere._instances;
            e[d.version] = I(function() {
                D(this, f, d)
            })
        } else {
            setTimeout(function() {
                Y(d, f)
            }, 20)
        }
    }

    function L(f) {
        var g = [];
        for (var e = 0,d = f.length; e < d; e++) {
            g.push(f[e])
        }
        return g
    }

    window.twttr = window.twttr || {};
    twttr.anywhere = function(f, h) {
        if (E == "callback" || E == "headless") {
            return
        }
        if (typeof f == "function") {
            h = f;
            f = twttr.anywhere._config.defaultVersion
        }
        if (!twttr.anywhere._config.clientID) {
            return Z("To set up @anywhere, please provide a client ID")
        }
        var e;
        var g = twttr.anywhere._instances;
        if (typeof f === "string" || typeof f === "number") {
            f = {version:f}
        }
        var d = (f.version) ? f.version.toString() : twttr.anywhere._config.defaultVersion;
        f.version = twttr.anywhere._getVersion(d);
        if (!f.version) {
            return Z("No @anywhere version matching " + d)
        }
        f = F({window:window}, f);
        if ((e = g[f.version])) {
            if (e.contentWindow._ready) {
                e.contentWindow._init(h, f)
            } else {
                a(e.contentWindow, h, f)
            }
        } else {
            Y(f, h)
        }
    };
    F(twttr.anywhere, {versions:["_dev","1","chirp_preview","pre","1.1","1.1.1","1.1.2","1.1.3"],_instances:{},_clients:[],_config:{defaultVersion:"1",assetHost:"platform{i}.twitter.com",secureAssetHost:"twitter-any.s3.amazonaws.com",baseHost:"twitter.com",serverHost:"api.twitter.com",serverPath:"xd_receiver.html",oauthHost:"oauth.twitter.com",ignoreSSL:false},_getVersion:function(e) {
        if (!e) {
            return null
        }
        e = e.toString();
        var g = [];
        for (var f = 0,d; (d = twttr.anywhere.versions[f]); f++) {
            if (d.indexOf(e) === 0) {
                g.push(d)
            }
        }
        return g.sort()[g.length - 1]
    },config:function(d) {
        if (typeof d === "string") {
            this._config.clientID = d;
            return this._config
        }
        return F(this._config, d || {})
    },signOut:function() {
        K(this);
        if (W) {
            W.set(R, "true")
        }
    },widget:function() {
        var f = "twttr_anywhere_widget_",e = A++,d = L(arguments);
        document.write('<span id="' + f + e + '"></span>');
        twttr.anywhere(function(h) {
            var g = "#" + f + e,j = d.shift(),i = h(g);
            i[j].apply(i, d)
        })
    },_removeToken:function() {
        this.token = null;
        if (W) {
            W.expire(B)
        }
    },_setToken:function(e) {
        var d;
        this.token = e;
        var f = W && W.get(B);
        if (W && (f != "" || !f)) {
            W.setWithExpiry(B, e, 2);
            W.expire(R)
        }
    },_removeHeadlessAuth:function() {
        if (this._headlessAuthWindow) {
            this._headlessAuthWindow.parentNode.removeChild(this._headlessAuthWindow);
            this._headlessAuthWindow = null
        }
    },_signedOutFlagPresent:function() {
        return W && W.get(R) == "true"
    },_proto:function(d) {
        return(window.location.protocol.match(/s\:$/) || d) && !twttr.anywhere._config.ignoreSSL ? "https" : "http"
    },_serverUrl:function(d) {
        if (twttr.anywhere._config.serverHost) {
            return this._proto(d) + "://" + [twttr.anywhere._config.serverHost,twttr.anywhere._config.serverPath].join("/")
        }
    },_assetUrl:function(e) {
        var g = this._proto(e);
        var f = (g == "https") ? twttr.anywhere._config.secureAssetHost : twttr.anywhere._config.assetHost;
        var d = f.replace("{i}", G++);
        if (G == 3) {
            G = 0
        }
        return g + "://" + d
    },_baseUrl:function(d) {
        return this._proto(d) + "://" + twttr.anywhere._config.baseHost
    },_oauthUrl:function(d) {
        return this._proto(d) + "://" + twttr.anywhere._config.oauthHost + "/2"
    }});
    twttr.anywhere._signedOutCookiePresent = twttr.anywhere._signedOutFlagPresent;
    E = U();
    var X = M();
    var N = X.clientID;
    var C = X.version;
    if (N) {
        twttr.anywhere._config.clientID = N
    }
    if (C) {
        twttr.anywhere._config.defaultVersion = C
    }
}());