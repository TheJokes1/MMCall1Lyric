import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  lyrics: string = '';
  title1 = '';
  performer1 = '';
  testTrack? : number;
  corsUrl: string = 'https://cors-anywhere.herokuapp.com/';
  baseUrl: string = 'http://api.musixmatch.com/ws/1.1/';
  token1 : string = '7fdc6e3e5841981064618c82bbab2c20';
  performer : string = '';
  max : number = 10;
  page? : number;
  a: any;
  b: any;
  listOfIds : Array<number> = [];
  listOfTitles : Array<string> = [];
  dictionary = new Map<string, string>();
  headers = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token1
  });

  constructor (private http: HttpClient){
  }

  getSongsId() {
    const urlMM: string = this.baseUrl + 'track.search?q_track=' + this.title +'&q_artist=' 
      + this.performer1 + '&apikey=' + this.token1;
      // + '&page_size='+ this.max + 's_artist_rating=asc&s_track_rating=desc' 
      // + '&page=' + 1 + '&apikey=' + this.token1;

    return this.http.get( 
      urlMM,
      { headers: this.headers }
      ).subscribe({
        next: (response: any) => {
          console.log('LYRICS: ', response);
          this.testTrack = response.message.body.track_list[0].track.track_id;
        
        },
        error: (response: any) => {
          console.log(response);
        },
        complete: () => {
          // this.get1LyricInfo(this.testTrack!).subscribe({
              // this.testTrack = 
              // 137924872;
              // 718360
            this.get1LyricInfo(this.testTrack!).subscribe({
              next: (response: any) => {
                console.log("LYRICS ARE: ", response);
                this.lyrics = response.message.body.lyrics.lyrics_body;
                // console.log(this.lyrics);
              this.dictionary.set(this.testTrack!.toString(), this.lyrics);
              console.log(this.dictionary);
              }
          })
        }
      })
    }

  getSongs() {
    this.dictionary.clear;
    console.log("PERFORMER: ", this.performer);
    this.getMMInfo(this.token1, this.performer).subscribe({
      next: (response: any) =>{
        console.log("LIST: ", response);
        for (let index = 0; index < response.message.body.track_list.length; index++) {
          this.listOfTitles[index] = response.message.body.track_list[index].track.track_name;
          this.listOfIds[index] = response.message.body.track_list[index].track.track_id;
          console.log(this.listOfTitles[index], " : ", response.message.body.track_list[index].track.num_favourite)
        }
      },
      error : (error : any) => {
        console.log(error);
      },
      complete : () =>{
        this.listOfTitles.forEach(element => {
          //console.log(element);          
        });
        this.getLyrics();
      }
    })
  }

  getLyrics() {
    console.log("in getLyrics");
    for (let index = 0; index < this.max; index++) {
      //this.listOfIds[index] = 718360
      this.get1LyricInfo(this.listOfIds[index]).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.lyrics = response.message.body.lyrics.lyrics_body;
          //console.log(this.listOfTitles[index], " : ", this.lyrics);
          this.dictionary.set(this.listOfTitles[index], this.lyrics);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log("DICTIONARY:", this.dictionary);
        }
      });
    }    
  }

  asIsOrder(a: any, b:any) {
    return 1;
  }

  getMMInfo = (token: any, performer: any) => { //call to MM
    //const performerPlus = performer.replaceAll(' ', '+');
    // http://api.musixmatch.com/ws/1.1/track.search?q_artist=justin bieber&page_size=3&page=1&s_track_rating=desc
    const urlMM: string = this.baseUrl + 'track.search?q_artist=' + performer + '&page_size='+ this.max 
      + 's_artist_rating=asc&s_track_rating=desc' + '&page=' + this.page + '&apikey=' + token;

    return this.http.get( 
      urlMM,
      { headers: this.headers }
    );
  };

  get1LyricInfo(lyricId: number) {
    const urlLyric: string = this.baseUrl + 'track.lyrics.get?track_id=' + lyricId 
        + '&apikey=' + this.token1;

    return this.http.get(
      urlLyric,
      {headers: this.headers}
    )
  }
}



// call getSongs() in constructor

// getSongs(){
//   getMMinfo(: 1 call for a certain artist returns results (10 track_ids + songTitle) => put in array;
//   complete => getLyrics();
// }

// getLyrics(){
//   for x = 1 to 10 {
//     getLyricInfo()
//     display }
//  }

// getlyricinfo() {
//   return actual LYRIC-body for the track_id  
// }