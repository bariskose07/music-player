class Music {
    constructor(id, title, singer, img, file, condition) {
        this.id = id;
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
        this.condition = condition;
    }

    getName() {
        return this.title + " - " + this.singer;
    }
}

const musicList = [
    // new Music(1, "Bir Derdim Var", "Mor ve Ötesi", "bdv1.jpg", "bir-derdim-var.mp3", "liked"),
    // new Music(2, "Ben Böyleyim", "Athena", "ben-boyleyim.jpg", "ben-boyleyim.mp3", "unliked"),
    // new Music(3, "In The End", "Linkin Park", "ite.jpg", "in-the-end.mp3", "unliked"),    
    // new Music(4, "We Could Be The Same", "Manga", "we-could-be-the-same.jpg", "we-could-be-the-same.mp3", "unliked"),
    // new Music(5, "This I Love", "Guns N' Roses", "til.jpg", "this-i-love.mp3", "unliked"),
    // new Music(6, "Kafama Göre", "Athena", "kafama-gore.jpg", "kafama-gore.mp3", "unliked"),
    // new Music(7, "Her Şeyi Yak", "Duman", "her-seyi-yak.jpg", "her-seyi-yak.mp3", "unliked"),
    // new Music(8, "Cevapsız Sorular", "Manga", "cevapsiz-sorular.jpg", "cevapsiz-sorular.mp3", "unliked"),
    // new Music(9, "Dibine Kadar", "Duman", "dibine-kadar.jpg", "dibine-kadar.mp3", "unliked"),
    // new Music(10, "Hint Kumaşı", "Manga", "isiklari-sondurseler-bile.jpg", "hint-kumasi.mp3", "unliked"),
    // new Music(11, "Acının İlacı", "Adamlar", "ruyalarda-burusmusum.jpg", "acinin-ilaci.mp3", "unliked"),
    // new Music(12, "En Güzel Günüm Gecem", "Duman", "en-guzel-gunum-gecem.jpg", "en-guzel-gunum-gecem.mp3", "unliked"),
    // new Music(13, "Işıkları Söndürseler Bile", "Manga", "isiklari-sondurseler-bile.jpg", "isiklari-sondurseler-bile.mp3", "unliked"),
    // new Music(14, "Rüyalarda Buruşmuşum", "Adamlar", "ruyalarda-burusmusum.jpg", "ruyalarda-burusmusum.mp3", "unliked"),
    // new Music(15, "Beggin'", "Maneskin", "beggin.jpg", "beggin.mp3", "unliked"),
    // new Music(16, "Madem", "Dolu Kadehi Ters Tut", "madem.jpg", "madem.mp3", "unliked"),
];