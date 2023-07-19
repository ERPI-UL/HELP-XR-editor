<template>
    <div
        ref="qr-scanner"
        class="flex grow items-center justify-center absolute w-full h-full bg-slate-900/[0.6] opacity-0 transition-all duration-300 hidden p-2"
    >
        <border-card
            ref="content"
            class="show-up flex flex-col bg-white w-min min-w-[20%] min-h-[20%] overflow-hidden"
        >
            <div class="flex">
                <div class="bg-indigo-600">
                    <div class="flex h-10 bg-white rounded-br-lg">
                        <img
                            src="../../assets/images/logo_indigo.png"
                            class="pl-2"
                            alt="indigo logo"
                        >
                    </div>
                </div>
                <div class="flex items-center bg-indigo-600 rounded-t-lg px-2">
                    <p class="text-lg font-semibold text-white mx-4 whitespace-nowrap text-ellipsis overflow-hidden"> Scanner </p>
                </div>
            </div>
            <div class="flex bg-indigo-600">
                <div class="flex flex-col w-full rounded-lg p-2 bg-indigo-700">
                    <div class="flex justify-center items-center bg-white rounded-md w-[15em] h-[15em] overflow-hidden">
                        <video
                            ref="video"
                            style="width: 100%; height: 100%; object-fit: cover;"
                        />
                    </div>
                    <div class="flex h-fit w-full justify-center pt-2">
                        <p
                            ref="log"
                            class="text-lg font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden"
                        > {{ lang.SCAN_ANCHOR }} </p>
                    </div>
                </div>
            </div>
        </border-card>
    </div>
</template>

<script>
import Lang from '../../script/Lang';
import BorderCard from '../cards/BorderCard.vue';
import QrScanner from '../../script/QRCode/qr-scanner.min.js'

export default {
    name: "QrScanner",
    components: {
        BorderCard
    },
    data() {
        return {
            lang: Lang.CurrentLang
        };
    },
    mounted() {
        const scanner = this.$refs['qr-scanner'];
        const content = this.$refs['content'];
        const router = document.getElementById("router-view");
        router.appendChild(scanner);

        scanner.addEventListener('click', ev => { this.close(); });
        content.$el.addEventListener('click', ev => { ev.stopPropagation(); });

        this.isSetup = false;
        this.shouldScan = false;
        let lastScanDate = Date.now();
        this.setupCam = () => {
            if (this.isSetup) return;
            this.isSetup = true;
            const video = this.$refs["video"];
            const scan = () => {
                if (scanner.classList.contains("hidden")) return;
                const now = Date.now();
                if (lastScanDate < now - 500) {
                    lastScanDate = now;
                    QrScanner.scanImage(video, { returnDetailedScanResult: true })
                        .then(result => this.onQRScanned(result))
                        .catch(error => {});
                }
                if (this.shouldScan) requestAnimationFrame(scan);
            };

            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia({ video: { facingMode: "environment" } }, (stream) => {
                video.srcObject = stream;
                video.play().then(() => {
                    this.shouldScan = true;
                    scan();
                });
            }, (err) => {
                console.error("err : ", err);
            });
        }

        this.open = () => {
            scanner.classList.remove("hidden");
            scanner.style.opacity = "0";
            setTimeout(() => { scanner.style.opacity = "1"; }, 10);
            this.setupCam();
        };
        this.close = () => {
            setTimeout(() => {
                scanner.style.opacity = "0";
                setTimeout(() => {
                    scanner.classList.add("hidden");
                }, 300);
            }, 10);
            if (this.qrScanner) this.scanner.stop();
        };

        this.onQRScanned = (result) => {
            if (!result?.data) return;
            const data = result.data;

            if (!data.includes("id=")) return this.onError('invalid');
            const id = data.split("id=")[1];
            if (!id) return this.onError('invalid');

            this.shouldScan = false;
            this.$router.push("/workplaces/view?id=" + id);
        };

        this.errTimeout = null;
        this.onError = (type) => {
            switch (type) {
            case 'invalid':
                if (this.$refs['log'].innerText !== this.lang.INVALID_ANCHOR) {
                    console.log("INVALID")
                    this.$refs['log'].innerText = this.lang.INVALID_ANCHOR;
                    this.$refs['log'].classList.add("shake");
                    navigator.vibrate(100);
                }
                break;
                
            default:
                break;
            }

            if (this.errTimeout) clearTimeout(this.errTimeout);
            this.errTimeout = setTimeout(() => {
                this.$refs['log'].innerText = this.lang.SCAN_ANCHOR;
                this.$refs['log'].classList.remove("shake");
            }, 2000);
        }
    }
}
</script>
