import React, { Component } from "react";
import "./BlogPost.css";
import Post from "../../component/BlogPost/Post";
import API from "../../services";
import firebase from "firebase";
import { firebaseConfig } from "../../services/Config";

class BlogPost extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(firebaseConfig);
    this.state = {
      listArtikel: [],
    };
  }

  ambilDataDariServerAPI = () => {
    let ref = firebase.database().ref("/");
    ref.on("value", (snapshot) => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  simpanDataKeServerAPI = () => {
    firebase.database().ref("/").set(this.state);
  };

  componentDidMount() {
    this.ambilDataDariServerAPI();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.simpanDataKeServerAPI();
    }
  }

  handleHapusArtikel = (idArtikel) => {
    const { listArtikel } = this.state;
    const newState = listArtikel.filter((data) => {
      return data.uid !== idArtikel;
    });
    this.setState({ listArtikel: newState });
  };

  handleTombolSimpan = (event) => {
    let title = this.refs.judulArtikel.value;
    let body = this.refs.isiArtikel.value;
    let uid = this.refs.uid.value;

    if (uid && title && body) {
      const { listArtikel } = this.state;
      const indeksArtikel = listArtikel.findIndex((data) => {
        return data.uid === uid;
      });
    } else if (title && body) {
      const uid = new Date().getTime().toString();
      const { listArtikel } = this.state;
      listArtikel.push({ uid, title, body });
      this.setState({ listArtikel });
    }
  };

  render() {
    return (
      <div className="post-artikel">
        <div className="form pb-2 border-bottom">
          <div className="form-group row">
            <label htmlFor="title" className="col-sm-2 col-form-label">
              Judul
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                onChange={this.handleTambahArtikel}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="body" className="col-sm-2 col-form-label">
              Isi
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="body"
                name="body"
                rows="3"
                onChange={this.handleTambahArtikel}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.handleTombolSimpan}
          >
            Simpan
          </button>
        </div>
        <h2>Daftar Artikel</h2>
        {this.state.listArtikel.map((artikel) => {
          // looping dan masukkan untuk setiap data yang ada di listArtikel ke variabel artikel
          return (
            <Post
              key={artikel.id}
              judul={artikel.title}
              isi={artikel.body}
              idArtikel={artikel.id}
              hapusArtikel={this.handleHapusArtikel}
            />
          ); // mappingkan data json dari API sesuai dengan kategorinya
        })}
      </div>
    );
  }
}

export default BlogPost;
