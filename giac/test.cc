#include <iostream>
using namespace std;

typedef long long longlong;
longlong multiplication(longlong a,longlong b){
  longlong c=a*b;
  return c;
}

int main(){
  long long a=1 <<30;
  long long b=a;
  cout << multiplication(a,b) << endl;
}
